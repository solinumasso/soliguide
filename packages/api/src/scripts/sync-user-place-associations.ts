import "../instrument";

import mongoose from "mongoose";
import { existsSync, readFileSync, writeFileSync } from "fs";

import { UserStatus } from "@soliguide/common";

import { connectToDatabase } from "../config/database/connection";
import { logger } from "../general/logger";
import { UserModel } from "../user/models/user.model";
import { DEFAULT_USER_POPULATE } from "../user/constants";
import { getUserRightsWithParams } from "../user/services/userRights.service";
import type { UserPopulateType } from "../_models";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const BREVO_API_KEY = process.env.BREVO_API_KEY;

const IS_TEST = process.argv.includes("--test");
const DB_BATCH_SIZE = IS_TEST ? 5 : 1000;
const BREVO_BATCH_SIZE = IS_TEST ? 5 : 500;
const CONTACT_FETCH_CONCURRENCY = 10; // GET /contacts en parallele
const DELAY_BETWEEN_BATCHES_MS = 2_000;
const MAX_RETRIES = 5;
const RETRY_BASE_DELAY_MS = 60_000;
const CHECKPOINT_FILE = "/tmp/sync-brevo-places-checkpoint.txt";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  attempt = 0
): Promise<Response> {
  const res = await fetch(url, options);

  if (res.status === 429 || res.status >= 500) {
    if (attempt >= MAX_RETRIES) {
      throw new Error(
        `Max retries reached for ${url} — last status: ${res.status}`
      );
    }
    const resetIn = res.headers.get("x-sib-ratelimit-reset");
    const waitMs = resetIn
      ? parseInt(resetIn) * 1000
      : RETRY_BASE_DELAY_MS * (attempt + 1);
    logger.warn(
      `Rate limit (${res.status}), waiting ${waitMs / 1000}s (attempt ${
        attempt + 1
      }/${MAX_RETRIES})`
    );
    await sleep(waitMs);
    return fetchWithRetry(url, options, attempt + 1);
  }

  const remaining = res.headers.get("x-sib-ratelimit-remaining");
  const resetIn = res.headers.get("x-sib-ratelimit-reset");
  if (remaining !== null && parseInt(remaining) === 0 && resetIn !== null) {
    const waitMs = parseInt(resetIn) * 1000;
    logger.info(`Brevo quota exhausted, waiting ${waitMs / 1000}s`);
    await sleep(waitMs);
  }

  return res;
}

// ---------------------------------------------------------------------------
// Brevo — get contact IDs en parallele avec cache
// ---------------------------------------------------------------------------

const contactIdCache = new Map<string, number>();

async function getContactId(email: string): Promise<number | null> {
  if (contactIdCache.has(email)) return contactIdCache.get(email)!;

  const res = await fetchWithRetry(
    `https://api.brevo.com/v3/contacts/${email}`,
    {
      method: "GET",
      headers: { "api-key": BREVO_API_KEY! },
    }
  );

  if (!res.ok) {
    logger.warn(`Contact not found in Brevo: ${email} (${res.status})`);
    return null;
  }

  const data = await res.json();
  const id = data.id ?? null;
  if (id) contactIdCache.set(email, id);
  return id;
}

async function getContactIds(emails: string[]): Promise<Map<string, number>> {
  const result = new Map<string, number>();

  // Filtre les emails deja en cache
  const toFetch = emails.filter((e) => !contactIdCache.has(e));
  const cached = emails.filter((e) => contactIdCache.has(e));

  for (const email of cached) {
    result.set(email, contactIdCache.get(email)!);
  }

  // Fetch les manquants par chunks de CONTACT_FETCH_CONCURRENCY en parallele
  for (let i = 0; i < toFetch.length; i += CONTACT_FETCH_CONCURRENCY) {
    const chunk = toFetch.slice(i, i + CONTACT_FETCH_CONCURRENCY);
    await Promise.all(
      chunk.map(async (email) => {
        const id = await getContactId(email);
        if (id) result.set(email, id);
      })
    );
  }

  return result;
}

// ---------------------------------------------------------------------------
// Brevo — link places in bulk via numeric contact ID
// ---------------------------------------------------------------------------

async function linkPlacesBulk(users: UserPopulateType[]): Promise<void> {
  // Collecte tous les emails qui ont des places verified
  const usersWithPlaces = users.filter((u) => {
    const verified = (u.userRights ?? []).filter(
      (r) => r.place_id && r.status === "VERIFIED"
    );
    return u.mail && verified.length > 0;
  });

  if (usersWithPlaces.length === 0) {
    logger.info("No users with verified places in this batch");
    return;
  }

  // Recupere tous les contactIds en parallele
  const emails = usersWithPlaces.map((u) => u.mail!);
  const contactIds = await getContactIds(emails);

  logger.info(
    `Fetched ${contactIds.size}/${emails.length} contact IDs from Brevo`
  );

  // Regroupe par placeId -> [contactIds]
  const placeMap = new Map<string, number[]>();

  for (const user of usersWithPlaces) {
    const contactId = contactIds.get(user.mail!);
    if (!contactId) continue;

    const verifiedRights = (user.userRights ?? []).filter(
      (r) => r.place_id && r.status === "VERIFIED"
    );

    logger.info(
      `[contact] mail=${user.mail} id=${contactId} verified_places=${
        verifiedRights.length
      } place_ids=[${verifiedRights.map((r) => r.place_id).join(", ")}]`
    );

    for (const right of verifiedRights) {
      const key = String(right.place_id);
      if (!placeMap.has(key)) placeMap.set(key, []);
      placeMap.get(key)!.push(contactId);
    }
  }

  if (placeMap.size === 0) {
    logger.info("No place associations to create for this batch");
    return;
  }

  // Brevo limite a 10 associations par record — on split en chunks de 10
  const records: any[] = [];
  for (const [ext_id, ids] of placeMap.entries()) {
    for (let i = 0; i < ids.length; i += 10) {
      const chunk = ids.slice(i, i + 10);
      records.push({
        identifiers: { ext_id },
        associations: [
          {
            object_type: "contact",
            action: "link",
            records: chunk.map((id) => ({ identifiers: { id } })),
          },
        ],
      });
    }
  }

  // Brevo limite a 1000 records par requete — on split si necessaire
  for (let i = 0; i < records.length; i += 1000) {
    const chunk = records.slice(i, i + 1000);

    const res = await fetchWithRetry(
      "https://api.brevo.com/v3/objects/place/batch/upsert",
      {
        method: "POST",
        headers: {
          "api-key": BREVO_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records: chunk }),
      }
    );

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`linkPlacesBulk failed: ${res.status} — ${body}`);
    }

    logger.info(
      `Brevo place associations OK — ${chunk.length} records (${placeMap.size} places)`
    );
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function run(): Promise<void> {
  if (!BREVO_API_KEY) {
    logger.error("BREVO_API_KEY is not set");
    process.exit(1);
  }

  await connectToDatabase();

  // Reprend depuis le checkpoint si existe
  let lastId: string | null = existsSync(CHECKPOINT_FILE)
    ? readFileSync(CHECKPOINT_FILE, "utf-8").trim() || null
    : null;

  if (lastId) {
    logger.info(`Resuming from checkpoint: ${lastId}`);
  }

  logger.info(
    IS_TEST
      ? "SCRIPT - SYNC PLACE ASSOCIATIONS TO BREVO\tTEST (5 users)"
      : "SCRIPT - SYNC PLACE ASSOCIATIONS TO BREVO\tSTART"
  );

  let totalSent = 0;
  let batch: UserPopulateType[] = [];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const paginatedFilter: mongoose.FilterQuery<UserPopulateType> = {
      status: { $in: [UserStatus.PRO, UserStatus.ADMIN_TERRITORY] },
      ...(lastId ? { _id: { $gt: new mongoose.Types.ObjectId(lastId) } } : {}),
    };

    const users = await UserModel.find(paginatedFilter)
      .populate(DEFAULT_USER_POPULATE)
      .sort({ _id: 1 })
      .limit(DB_BATCH_SIZE)
      .lean<UserPopulateType[]>()
      .exec();

    if (users.length === 0) break;

    lastId = users[users.length - 1]._id.toString();
    writeFileSync(CHECKPOINT_FILE, lastId);

    for (const user of users) {
      if (!user.userRights?.length) {
        user.userRights = await getUserRightsWithParams({ user: user._id });
      }

      batch.push(user);

      if (batch.length >= BREVO_BATCH_SIZE) {
        try {
          await linkPlacesBulk(batch);
          totalSent += batch.length;
          logger.info(
            `Progress: ${totalSent} users processed — checkpoint: ${lastId}`
          );
        } catch (err) {
          logger.error(err, `Batch failed — ${batch.length} users skipped`);
        }
        batch = [];
        await sleep(DELAY_BETWEEN_BATCHES_MS);
      }
    }

    logger.info(`DB page processed — ${totalSent} total so far`);

    if (IS_TEST) break;
  }

  // Flush last partial batch
  if (batch.length > 0) {
    try {
      await linkPlacesBulk(batch);
      totalSent += batch.length;
    } catch (err) {
      logger.error(err, "Final batch failed");
    }
  }

  logger.info(
    `SCRIPT - SYNC PLACE ASSOCIATIONS TO BREVO\tEND - ${totalSent} users processed`
  );

  // Supprime le checkpoint une fois termine avec succes
  writeFileSync(CHECKPOINT_FILE, "");

  await mongoose.connection.close();
}

run().catch((err) => {
  logger.error(err, "SYNC BREVO PLACES - Fatal error");
  process.exit(1);
});

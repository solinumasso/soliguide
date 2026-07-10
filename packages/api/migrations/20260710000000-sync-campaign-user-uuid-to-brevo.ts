import { Brevo, BrevoClient, BrevoError } from "@getbrevo/brevo";
import { Db } from "mongodb";

import { logger } from "../src/general/logger";
import { CONFIG } from "../src/_models/config";

const message = "Push campaignUserUuid to Brevo contacts (CAMPAIGN_USER_UUID)";
const usersCollection = "users";
// Update-only via `contacts.updateContact` — 404 = contact absent Brevo, skip.
// Sequential + 150 ms throttle to stay under Brevo's 10 req/s cap.
const THROTTLE_DELAY_MS = 150;
const LOG_EVERY = 100;

interface UserRow {
  mail: string;
  campaignUserUuid: string;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  // Prod-only : on ne veut pas écrire dans Brevo depuis les envs de préprod
  // (staging/demo) qui partagent souvent les mêmes destinataires réels.
  if (CONFIG.ENV !== "prod") {
    logger.info(
      `[MIGRATION] - skipped on env "${CONFIG.ENV}" (prod only), exiting`
    );
    return;
  }

  const apiKey = CONFIG.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is required to push contacts to Brevo");
  }

  const brevo = new BrevoClient({ apiKey });

  const filter = {
    campaignUserUuid: { $exists: true, $ne: null },
    mail: { $exists: true, $ne: "" },
    verified: true,
  };
  const collection = db.collection(usersCollection);

  const total = await collection.countDocuments(filter);
  logger.info(`[MIGRATION] - ${total} users to push`);

  if (total === 0) {
    logger.info("[MIGRATION] - nothing to do, exiting");
    return;
  }

  const cursor = collection.find<UserRow>(filter, {
    projection: { _id: 0, mail: 1, campaignUserUuid: 1 },
  });

  let updated = 0;
  let notFound = 0;
  let failed = 0;
  let seen = 0;

  for await (const { mail, campaignUserUuid } of cursor) {
    seen++;
    try {
      await brevo.contacts.updateContact({
        identifier: mail,
        attributes: { CAMPAIGN_USER_UUID: campaignUserUuid },
      });
      updated++;
    } catch (err) {
      if (err instanceof Brevo.NotFoundError) {
        notFound++;
      } else {
        failed++;
        const detail =
          err instanceof BrevoError
            ? `${err.statusCode} ${JSON.stringify(err.body)}`
            : String(err);
        logger.error(`[MIGRATION] - ${mail} failed: ${detail}`);
      }
    }

    if (seen % LOG_EVERY === 0) {
      logger.info(
        `[MIGRATION] - ${seen}/${total} processed (updated: ${updated}, notFound: ${notFound}, failed: ${failed})`
      );
    }

    await sleep(THROTTLE_DELAY_MS);
  }

  logger.info(
    `[MIGRATION] - done: ${seen}/${total} processed (updated: ${updated}, notFound: ${notFound}, failed: ${failed})`
  );
};

export const down = async () => {
  logger.info(`[ROLLBACK] - ${message} - no-op (Brevo attribute left as-is)`);
};

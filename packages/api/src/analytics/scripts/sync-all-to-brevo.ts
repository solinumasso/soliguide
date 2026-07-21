/**
 * Script: sync-all-to-brevo.ts
 *
 * Backfill one-shot de TOUTES les places et TOUS les users existants vers Brevo.
 *
 * On ne tape pas l'API Brevo directement : on publie les mêmes payloads que le
 * flux temps réel sur RabbitMQ, et n8n consomme la queue à son rythme (c'est
 * n8n qui applique le rate limit Brevo). Pour ne pas noyer les queues temps
 * réel `*.synchro_brevo`, le backfill publie sur des routing keys dédiées
 * `*.synchro_brevo_all` (miroir de `places.synchro_at_all` utilisé par le
 * backfill Airtable). Ces queues doivent être liées côté n8n avant le run,
 * sinon les messages sont droppés par l'exchange topic.
 *
 * Le débit de publication est throttlé (burst puis pause) pour alimenter le
 * broker de façon régulière plutôt qu'en une seule rafale.
 *
 * Usage :
 *   AMQP_URL=xxx MONGODB_URI=yyy yarn workspace @soliguide/api brevo:sync-all
 *   ... brevo:sync-all-places        # places uniquement
 *   ... brevo:sync-all-users         # users uniquement
 *   ... brevo:sync-all -- --dry-run  # compte sans publier (aucune écriture)
 */

import { ApiPlace, PlaceStatus } from "@soliguide/common";
import mongoose from "mongoose";

import { connectToDatabase } from "../../config/database/connection";
import { CONFIG, ModelWithId, User, UserPopulateType } from "../../_models";
import {
  AmqpSynchroAirtablePlaceEvent,
  AmqpSynchroAirtableUserEvent,
  AmqpSynchroPlaceBatchEvent,
  AmqpSynchroUserBatchEvent,
  amqpEventsSender,
  Exchange,
  RoutingKey,
} from "../../events";
import { logger } from "../../general/logger";
import { PlaceModel } from "../../place/models";
import { getThemeAndUrlFromPlace } from "../../place/utils";
import { UserModel } from "../../user/models/user.model";
import { buildUserSynchroEvent } from "../../user/services";
import { getThemeAndUrlFromUser } from "../../user/utils";

// ---------------------------------------------------------------------------
// Config (surchargeable par variables d'environnement)
// ---------------------------------------------------------------------------

/** Taille des pages Mongo (keyset pagination sur `_id`). */
const BATCH_SIZE = parseIntEnv(process.env.SYNC_BATCH_SIZE, 5000);
/** Nombre de publications avant une pause, pour lisser le débit vers RabbitMQ. */
const THROTTLE_BATCH_SIZE = parseIntEnv(process.env.SYNC_THROTTLE_BATCH_SIZE, 25);
/** Durée de la pause entre deux rafales de publication. */
const THROTTLE_DELAY_MS = parseIntEnv(process.env.SYNC_THROTTLE_DELAY_MS, 2000);
/**
 * Nombre de places regroupées par message (donc par appel `batch/upsert` côté
 * n8n). Réduit le nombre de requêtes Brevo pour rester sous la limite horaire
 * de l'endpoint objects. Borné pour respecter la taille de body max (1 Mo).
 */
const PLACES_BATCH_SIZE = parseIntEnv(process.env.SYNC_PLACES_BATCH_SIZE, 100);
/**
 * Nombre de users regroupés par message. Même logique que pour les places :
 * réduit le nombre d'appels côté n8n (upsert contacts en batch + regroupement
 * des liaisons contact -> places sur l'endpoint objects, qui est le goulot).
 */
const USERS_BATCH_SIZE = parseIntEnv(process.env.SYNC_USERS_BATCH_SIZE, 100);

const PLACES_ROUTING_KEY = `${RoutingKey.PLACES}.synchro_brevo_all`;
const USERS_ROUTING_KEY = `${RoutingKey.USERS}.synchro_brevo_all`;

/**
 * Périmètre des places à synchroniser vers Brevo.
 *
 * Le workflow n8n `Sync Brevo - All Places` ne traite que les places `ONLINE`
 * ou `OFFLINE` (node `Is place to sync?`) ; les brouillons (`DRAFT`) et les
 * fiches définitivement fermées (`PERMANENTLY_CLOSED`) sont ignorés. On aligne
 * le backfill pour ne pas injecter dans la queue des messages que le workflow
 * jetterait de toute façon.
 */
const PLACES_SYNC_FILTER: mongoose.FilterQuery<ApiPlace> = {
  status: { $in: [PlaceStatus.ONLINE, PlaceStatus.OFFLINE] },
};

/**
 * Périmètre des users à synchroniser vers Brevo.
 *
 * Le workflow n8n `Sync Brevo - Users` ne sait traiter que deux profils :
 * les traducteurs (branche « sync simplifié ») et les users disposant d'une
 * zone opérationnelle FR/ES/AD. Son node `Adapt data to brevo1` lève une
 * erreur pour tout autre user (pas de liste Brevo associée au pays). On aligne
 * donc le backfill sur ce contrat pour ne pas noyer n8n d'exécutions en échec.
 *
 * `areas` est indexé par code pays en minuscules (`fr`/`es`/`ad`).
 */
const USERS_SYNC_FILTER: mongoose.FilterQuery<User> = {
  $or: [
    { translator: true },
    { "areas.fr": { $exists: true } },
    { "areas.es": { $exists: true } },
    { "areas.ad": { $exists: true } },
  ],
};

type SyncTarget = "places" | "users" | "all";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseIntEnv(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * Pauses every `THROTTLE_BATCH_SIZE` publications so the broker is fed at a
 * steady rate rather than in a single burst.
 */
async function throttle(sentCount: number): Promise<void> {
  if (sentCount > 0 && sentCount % THROTTLE_BATCH_SIZE === 0) {
    await sleep(THROTTLE_DELAY_MS);
  }
}

function parseArgs(argv: string[]): { target: SyncTarget; dryRun: boolean } {
  const dryRun = argv.includes("--dry-run");
  const positional = argv.find((arg) => !arg.startsWith("--"));

  let target: SyncTarget = "all";
  if (positional === "places" || positional === "users") {
    target = positional;
  }

  return { target, dryRun };
}

// ---------------------------------------------------------------------------
// Places
// ---------------------------------------------------------------------------

async function syncAllPlaces(dryRun: boolean): Promise<void> {
  logger.info("BREVO SYNC - PLACES\tSTART");

  if (dryRun) {
    const total = await PlaceModel.countDocuments(PLACES_SYNC_FILTER);
    const messages = Math.ceil(total / PLACES_BATCH_SIZE);
    logger.info(
      `BREVO SYNC - PLACES\tDRY-RUN - ${total} place(s) in ${messages} message(s) of up to ${PLACES_BATCH_SIZE}`
    );
    return;
  }

  let lastId: mongoose.Types.ObjectId | null = null;
  let totalSent = 0;
  let messagesSent = 0;
  // Places accumulées en attente de publication (un message = un lot).
  let batch: AmqpSynchroAirtablePlaceEvent[] = [];

  // Publie le lot courant comme un seul message puis le vide.
  const flushBatch = async (): Promise<void> => {
    if (batch.length === 0) {
      return;
    }

    await amqpEventsSender.sendToQueue(
      Exchange.PLACES,
      PLACES_ROUTING_KEY,
      new AmqpSynchroPlaceBatchEvent(batch)
    );

    messagesSent++;
    totalSent += batch.length;
    batch = [];
    await throttle(messagesSent);
  };

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const paginatedFilter: mongoose.FilterQuery<ApiPlace> = lastId
      ? { ...PLACES_SYNC_FILTER, _id: { $gt: lastId } }
      : PLACES_SYNC_FILTER;

    const places: ModelWithId<ApiPlace>[] = await PlaceModel.find<
      ModelWithId<ApiPlace>
    >(paginatedFilter)
      .sort({ _id: 1 })
      .limit(BATCH_SIZE)
      .exec();

    if (places.length === 0) {
      break;
    }

    lastId = places[places.length - 1]._id ?? null;

    for (const place of places) {
      try {
        const { theme, frontendUrl } = getThemeAndUrlFromPlace(place);
        batch.push(
          new AmqpSynchroAirtablePlaceEvent(place, frontendUrl, theme)
        );

        if (batch.length >= PLACES_BATCH_SIZE) {
          await flushBatch();
        }
      } catch (err) {
        logger.error(
          `BREVO SYNC - PLACES\tfailed to prepare place ${place.lieu_id} (_id: ${place._id}): ${err}`
        );
      }
    }

    logger.info(
      `BREVO SYNC - PLACES\t${totalSent} place(s) sent in ${messagesSent} message(s) so far`
    );
  }

  // Publie le dernier lot partiel.
  await flushBatch();

  logger.info(
    `BREVO SYNC - PLACES\tEND - ${totalSent} place(s) sent in ${messagesSent} message(s)`
  );
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

async function syncAllUsers(dryRun: boolean): Promise<void> {
  logger.info("BREVO SYNC - USERS\tSTART");

  if (dryRun) {
    const total = await UserModel.countDocuments(USERS_SYNC_FILTER);
    const messages = Math.ceil(total / USERS_BATCH_SIZE);
    logger.info(
      `BREVO SYNC - USERS\tDRY-RUN - ${total} user(s) in ${messages} message(s) of up to ${USERS_BATCH_SIZE}`
    );
    return;
  }

  let lastId: mongoose.Types.ObjectId | null = null;
  let totalSent = 0;
  let messagesSent = 0;
  // Users accumulés en attente de publication (un message = un lot).
  let batch: AmqpSynchroAirtableUserEvent[] = [];

  // Publie le lot courant comme un seul message puis le vide.
  const flushBatch = async (): Promise<void> => {
    if (batch.length === 0) {
      return;
    }

    await amqpEventsSender.sendToQueue(
      Exchange.USERS,
      USERS_ROUTING_KEY,
      new AmqpSynchroUserBatchEvent(batch)
    );

    messagesSent++;
    totalSent += batch.length;
    batch = [];
    await throttle(messagesSent);
  };

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const paginatedFilter: mongoose.FilterQuery<User> = lastId
      ? { ...USERS_SYNC_FILTER, _id: { $gt: lastId } }
      : USERS_SYNC_FILTER;

    // `+campaignUserUuid` : champ `select: false` requis par le payload Brevo.
    // Sans lui, `buildUserSynchroEvent` régénérerait un uuid en mémoire et
    // enverrait à Brevo une valeur différente de celle stockée en base.
    const users: UserPopulateType[] = await UserModel.find(paginatedFilter)
      .select("+campaignUserUuid")
      .sort({ _id: 1 })
      .limit(BATCH_SIZE)
      .populate([
        "organizations",
        "invitations",
        {
          path: "invitations",
          populate: { path: "organization", select: "_id organization_id" },
        },
      ])
      .lean<UserPopulateType[]>()
      .exec();

    if (users.length === 0) {
      break;
    }

    lastId = users[users.length - 1]._id ?? null;

    for (const user of users) {
      try {
        const { theme, frontendUrl } = getThemeAndUrlFromUser(user);
        batch.push(await buildUserSynchroEvent(user, frontendUrl, theme));

        if (batch.length >= USERS_BATCH_SIZE) {
          await flushBatch();
        }
      } catch (err) {
        logger.error(
          `BREVO SYNC - USERS\tfailed to prepare user ${user.user_id} (_id: ${user._id}): ${err}`
        );
      }
    }

    logger.info(
      `BREVO SYNC - USERS\t${totalSent} user(s) sent in ${messagesSent} message(s) so far`
    );
  }

  // Publie le dernier lot partiel.
  await flushBatch();

  logger.info(
    `BREVO SYNC - USERS\tEND - ${totalSent} user(s) sent in ${messagesSent} message(s)`
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const { target, dryRun } = parseArgs(process.argv.slice(2));

  // Garde-fou : `sendToQueue` est un no-op silencieux sans AMQP_URL (ou en
  // env test). On refuse de "réussir" sans rien envoyer.
  if (!dryRun && (!CONFIG.AMQP_URL || CONFIG.ENV === "test")) {
    throw new Error(
      "AMQP_URL is required (and ENV must not be 'test') to publish to RabbitMQ"
    );
  }

  logger.info(
    { target, dryRun, BATCH_SIZE, THROTTLE_BATCH_SIZE, THROTTLE_DELAY_MS },
    "BREVO SYNC - starting one-shot backfill"
  );

  await connectToDatabase();

  try {
    if (target === "all" || target === "places") {
      await syncAllPlaces(dryRun);
    }
    if (target === "all" || target === "users") {
      await syncAllUsers(dryRun);
    }
  } finally {
    // Ferme proprement le channel AMQP (flush des publications bufferisées)
    // avant de couper Mongo.
    await amqpEventsSender.close();
    await mongoose.disconnect();
  }

  logger.info("BREVO SYNC - done");
}

main().catch((err) => {
  logger.error({ err }, "BREVO SYNC - fatal error");
  process.exitCode = 1;
});

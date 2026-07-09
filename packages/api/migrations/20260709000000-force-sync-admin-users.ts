/*
 * Migration ponctuelle : ré-émet un event `synchro_at` pour tous les users
 * `ADMIN_SOLIGUIDE` / `ADMIN_TERRITORY` afin que le consumer Brevo/Airtable
 * pousse leur `campaignUserUuid` fraîchement projeté (`AmqpUser`).
 *
 * Objectif produit : tester la MAJ Brevo sur un scope réduit (admins) avant de
 * l'ouvrir aux comptes PRO.
 *
 * Rupture assumée du pattern habituel (`updateMany` + pipeline) : cette
 * migration ne modifie **rien** en base, elle publie N messages sur RabbitMQ.
 * Idempotence : ré-émettre un event `synchro_at` est safe côté consumer (les
 * upserts Brevo sont, eux, idempotents).
 *
 * `down` = no-op (pas de rollback pertinent pour un side-effect externe).
 */
import { Db } from "mongodb";
import mongoose from "mongoose";

import { Themes, UserStatus } from "@soliguide/common";

import { logger } from "../src/general/logger";
import { getUserByIdWithUserRights } from "../src/user/services/users.service";
import {
  getUserLastCampaignsChangesStatus,
  getUserRightsForCampaignStatus,
  getUserToUpdateStatus,
} from "../src/user/services/userRights.service";
import { amqpEventsSender } from "../src/events/services/AmqpEventsSender";
import { Exchange, RoutingKey } from "../src/events";
import { AmqpSynchroAirtableUserEvent } from "../src/events/classes/AmqpSynchroAirtableUserEvent.class";
import { CONFIG } from "../src/_models/config";

const message = "Force AT sync for ADMIN_SOLIGUIDE + ADMIN_TERRITORY users";
const usersCollection = "users";

// Contexte requête synthétique : les admins reçoivent le lien via le domaine
// principal FR ; le consumer Brevo mappe seulement l'attribut `campaignUserUuid`,
// il ne consomme pas ce champ pour construire une URL. Choix documenté ici pour
// éviter la dispersion domain-per-user dans ce script one-shot.
const DEFAULT_FRONT_URL = CONFIG.SOLIGUIDE_FR_URL;
const DEFAULT_THEME: Themes = Themes.SOLIGUIDE_FR;

const ADMIN_STATUSES: UserStatus[] = [
  UserStatus.ADMIN_SOLIGUIDE,
  UserStatus.ADMIN_TERRITORY,
];

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  // Restreint volontairement à la prod : on ne veut pas polluer Brevo/Airtable
  // depuis les envs de préprod (staging/demo) qui partagent parfois les mêmes
  // destinataires externes.
  if (CONFIG.ENV !== "prod") {
    logger.info(
      `[MIGRATION] - skipped on env "${CONFIG.ENV}" (prod only), exiting`
    );
    return;
  }

  // Découverte via raw `db` (pas de dépendance à l'état de connexion Mongoose
  // au moment où migrate-mongo entre dans `up`). Les writes/populate ensuite
  // passent par Mongoose — la lazy-connect se déclenchera au premier accès.
  const adminIds = await db
    .collection(usersCollection)
    .find({ status: { $in: ADMIN_STATUSES } }, { projection: { _id: 1 } })
    .toArray();

  logger.info(`[MIGRATION] - ${adminIds.length} admin(s) trouvé(s)`);

  if (adminIds.length === 0) {
    logger.info("[MIGRATION] - nothing to do, exiting");
    return;
  }

  let sent = 0;
  let failed = 0;

  for (const { _id } of adminIds) {
    try {
      const user = await getUserByIdWithUserRights(_id);
      if (!user) {
        failed++;
        logger.warn(
          { _id },
          "[MIGRATION] - user not found via Mongoose, skipping"
        );
        continue;
      }

      const userRights = await getUserRightsForCampaignStatus(user._id);
      const toUpdate = getUserToUpdateStatus(userRights);
      const { midYear, endYear } =
        getUserLastCampaignsChangesStatus(userRights);

      const payload = new AmqpSynchroAirtableUserEvent(
        user,
        DEFAULT_FRONT_URL,
        DEFAULT_THEME,
        false,
        toUpdate,
        midYear,
        endYear
      );

      await amqpEventsSender.sendToQueue<AmqpSynchroAirtableUserEvent>(
        Exchange.USERS,
        `${RoutingKey.USERS}.synchro_at`,
        payload,
        logger
      );

      sent++;
      if (sent % 25 === 0) {
        logger.info(`[MIGRATION] - ${sent}/${adminIds.length} events sent`);
      }
    } catch (err) {
      failed++;
      logger.error({ err, _id }, "[MIGRATION] - failed to publish event");
    }
  }

  logger.info(
    `[MIGRATION] - done: ${sent} sent, ${failed} failed, ${adminIds.length} total`
  );

  // Ferme la connexion Mongoose ouverte par les services : migrate-mongo tient
  // sa propre connexion mongodb driver, la nôtre serait laissée pendante sinon.
  await mongoose.disconnect();
  await amqpEventsSender.close();
};

export const down = async () => {
  logger.info(
    `[ROLLBACK] - ${message} : no-op (side-effect externe, pas de rollback)`
  );
};

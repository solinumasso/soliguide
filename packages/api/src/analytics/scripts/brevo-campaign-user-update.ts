#!/usr/bin/env tsx

/**
 * Script: brevo-campaign-user-update.ts
 *
 * Upsert des contacts dans Brevo.
 * Logique : si un utilisateur est lié (OWNER, EDITOR ou READER, statut VERIFIED) à au moins
 * une structure ayant complété la campagne précédente (ex MID_YEAR_2026= MID_YEAR_2025)
 * alors CHANGE_CAMPAIGN_MID_YEAR = true (booléen).
 *
 * Usage :
 *   BREVO_API_KEY=xxx MONGODB_URI=yyy yarn workspace @soliguide/api brevo:campaign-user-update
 */

import mongoose from "mongoose";
import axios from "axios";

import {
  CampaignName,
  CampaignStatus,
  UserRole,
  UserRightStatus,
} from "@soliguide/common";

import { connectToDatabase } from "../../config/database/connection";
import { PlaceModel } from "../../place/models";
import { UserRightModel } from "../../user/models/userRight.model";
import { UserModel } from "../../user/models/user.model";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

// À adapter selon la campagne ciblée
const CAMPAIGN = CampaignName.MID_YEAR_2025;
// Soit CHANGE_CAMPAIGN_MID_YEAR, soit CHANGE_CAMPAIGN_END_YEAR
const BREVO_ATTRIBUTE = "CHANGE_CAMPAIGN_MID_YEAR";
const BREVO_BATCH_SIZE = 100; // limite API Brevo

const BREVO_API_KEY = process.env.BREVO_API_KEY;

if (!BREVO_API_KEY) {
  console.error("BREVO_API_KEY is required");
  process.exit(1);
}

const brevoClient = axios.create({
  baseURL: "https://api.brevo.com/v3",
  headers: {
    "api-key": BREVO_API_KEY,
    "Content-Type": "application/json",
  },
});

/** Rôles considérés comme "avoir des droits" sur une structure */
const ROLES_WITH_RIGHTS: UserRole[] = [
  UserRole.OWNER,
  UserRole.EDITOR,
  UserRole.READER,
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function upsertBatch(emails: string[]): Promise<void> {
  await brevoClient.post("/contacts/batch", {
    contacts: emails.map((email) => ({
      email,
      attributes: { [BREVO_ATTRIBUTE]: true },
      updateEnabled: true,
    })),
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  await connectToDatabase();

  console.log(`[1/4] Recherche des structures ayant complété ${CAMPAIGN}...`);

  const completedPlaces = await PlaceModel.find(
    { [`campaigns.${CAMPAIGN}.status`]: CampaignStatus.FINISHED },
    { lieu_id: 1 }
  ).lean();

  const completedPlaceIds = completedPlaces.map((p) => p.lieu_id);
  console.log(`      → ${completedPlaceIds.length} structure(s) trouvée(s)`);

  if (completedPlaceIds.length === 0) {
    console.log("Aucune structure n'a complété la campagne. Fin du script.");
    await mongoose.disconnect();
    return;
  }

  console.log("[2/4] Recherche des utilisateurs liés à ces structures...");

  const userRights = await UserRightModel.find(
    {
      place_id: { $in: completedPlaceIds },
      role: { $in: ROLES_WITH_RIGHTS },
      status: UserRightStatus.VERIFIED,
    },
    { user_id: 1 }
  ).lean();

  const userIds = [...new Set(userRights.map((r) => r.user_id))];
  console.log(`      → ${userIds.length} utilisateur(s) concerné(s)`);

  if (userIds.length === 0) {
    console.log("Aucun utilisateur trouvé. Fin du script.");
    await mongoose.disconnect();
    return;
  }

  console.log("[3/4] Récupération des emails...");

  const users = await UserModel.find(
    { user_id: { $in: userIds } },
    { mail: 1 }
  ).lean();

  const emails = users.map((u) => u.mail);
  console.log(`      → ${emails.length} email(s) récupéré(s)`);

  await mongoose.disconnect();

  console.log(`[4/4] Upsert dans Brevo par batch de ${BREVO_BATCH_SIZE}...`);

  const batches = chunk(emails, BREVO_BATCH_SIZE);
  let done = 0;

  for (const batch of batches) {
    await upsertBatch(batch);
    done += batch.length;
    process.stdout.write(`\r      → ${done}/${emails.length} contacts envoyés`);
  }

  console.log(`\n\nTerminé. ${emails.length} contacts mis à jour dans Brevo.`);
  console.log(`Attribut : ${BREVO_ATTRIBUTE} = true (booléen)`);
}

main().catch((err) => {
  const message = axios.isAxiosError(err)
    ? `Erreur Brevo ${err.response?.status}: ${JSON.stringify(
        err.response?.data
      )}`
    : String(err);
  console.error("\nErreur :", message);
  mongoose.disconnect().finally(() => process.exit(1));
});

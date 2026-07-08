import { Schema, model } from "mongoose";

import {
  CAMPAIGN_SECTION_PATHS,
  CampaignPlaceParticipationStatus,
  type CampaignPlaceParticipation,
} from "@soliguide/common";

const SectionStateSchema = new Schema(
  {
    completedAt: { default: null, type: Date },
  },
  { _id: false }
);

// Une entrée `sections` par CampaignSectionPath. Mongoose ne type pas nativement
// les objets à clefs contraintes → on déclare un sous-schéma explicite pour
// chaque path, avec `default` sur les 10 valeurs (permet de req/upsert
// idempotent depuis le job de matérialisation).
const sectionsSchemaDefinition = Object.fromEntries(
  CAMPAIGN_SECTION_PATHS.map((path) => [
    path,
    { default: () => ({ completedAt: null }), type: SectionStateSchema },
  ])
);

export const CampaignPlaceParticipationSchema =
  new Schema<CampaignPlaceParticipation>(
    {
      campaignSlug: { required: true, trim: true, type: String },
      lieu_id: { required: true, type: Number },

      status: {
        default: CampaignPlaceParticipationStatus.TO_DO,
        enum: CampaignPlaceParticipationStatus,
        index: true,
        required: true,
        type: String,
      },

      sections: {
        default: () => ({}),
        type: sectionsSchemaDefinition,
      },

      startedAt: { default: null, type: Date },
      completedAt: { default: null, type: Date },
    },
    { strict: true, timestamps: true }
  );

// Unicité (campagne, fiche) — garantit l'idempotence des upserts par le job
// de matérialisation.
CampaignPlaceParticipationSchema.index(
  { campaignSlug: 1, lieu_id: 1 },
  { unique: true }
);

// Ciblage des relances par campagne + statut.
CampaignPlaceParticipationSchema.index({ campaignSlug: 1, status: 1 });

export const CampaignPlaceParticipationModel =
  model<CampaignPlaceParticipation>(
    "CampaignPlaceParticipation",
    CampaignPlaceParticipationSchema,
    "campaign_place_participations"
  );

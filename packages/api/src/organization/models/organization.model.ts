import { ApiOrganization, CampaignStatus, RELATIONS } from "@soliguide/common";
import mongoose, { model } from "mongoose";
import { ModelWithId } from "../../_models";
import { PhoneSchema } from "../../place/models";

/**
 * @swagger
 * definitions:
 *   Organization:
 */
const OrganizationSchema = new mongoose.Schema<ModelWithId<ApiOrganization>>(
  {
    areas: {
      type: Object,
    },
    campaigns: {
      MAJ_ETE_2022: {
        autonomyRate: { default: 0, type: Number },
        endDate: {
          default: null,
          type: Date,
        },
        startDate: {
          default: null,
          type: Date,
        },
        status: {
          default: CampaignStatus.TO_DO,
          enum: CampaignStatus,
          type: String,
          uppercase: true,
        },
        toUpdate: {
          default: false,
          required: true,
          type: Boolean,
        },
      },
      MAJ_ETE_2023: {
        autonomyRate: { default: 0, type: Number },
        endDate: {
          default: null,
          type: Date,
        },
        startDate: {
          default: null,
          type: Date,
        },
        status: {
          default: CampaignStatus.TO_DO,
          enum: CampaignStatus,
          type: String,
          uppercase: true,
        },
        toUpdate: {
          default: false,
          required: true,
          type: Boolean,
        },
      },
      MAJ_ETE_2024: {
        autonomyRate: { default: 0, type: Number },
        endDate: {
          default: null,
          type: Date,
        },
        startDate: {
          default: null,
          type: Date,
        },
        status: {
          default: CampaignStatus.TO_DO,
          enum: CampaignStatus,
          type: String,
          uppercase: true,
        },
        toUpdate: {
          default: false,
          required: true,
          type: Boolean,
        },
      },
      MAJ_HIVER_2022: {
        autonomyRate: { default: 0, type: Number },
        endDate: {
          default: null,
          type: Date,
        },
        startDate: {
          default: null,
          type: Date,
        },
        status: {
          default: CampaignStatus.TO_DO,
          enum: CampaignStatus,
          type: String,
          uppercase: true,
        },
        toUpdate: {
          default: false,
          required: true,
          type: Boolean,
        },
      },
      MAJ_HIVER_2023: {
        autonomyRate: { default: 0, type: Number },
        endDate: {
          default: null,
          type: Date,
        },
        startDate: {
          default: null,
          type: Date,
        },
        status: {
          default: CampaignStatus.TO_DO,
          enum: CampaignStatus,
          type: String,
          uppercase: true,
        },
        toUpdate: {
          default: false,
          required: true,
          type: Boolean,
        },
      },
      END_YEAR_2024: {
        autonomyRate: { default: 0, type: Number },
        endDate: {
          default: null,
          type: Date,
        },
        startDate: {
          default: null,
          type: Date,
        },
        status: {
          default: CampaignStatus.TO_DO,
          enum: CampaignStatus,
          type: String,
          uppercase: true,
        },
        toUpdate: {
          default: false,
          required: true,
          type: Boolean,
        },
      },
      MID_YEAR_2025: {
        autonomyRate: { default: 0, type: Number },
        endDate: {
          default: null,
          type: Date,
        },
        startDate: {
          default: null,
          type: Date,
        },
        status: {
          default: CampaignStatus.TO_DO,
          enum: CampaignStatus,
          type: String,
          uppercase: true,
        },
        toUpdate: {
          default: false,
          required: true,
          type: Boolean,
        },
      },
      END_YEAR_2025: {
        autonomyRate: { default: 0, type: Number },
        endDate: {
          default: null,
          type: Date,
        },
        startDate: {
          default: null,
          type: Date,
        },
        status: {
          default: CampaignStatus.TO_DO,
          enum: CampaignStatus,
          type: String,
          uppercase: true,
        },
        toUpdate: {
          default: false,
          required: true,
          type: Boolean,
        },
      },
      UKRAINE_2022: {
        endDate: {
          default: null,
          type: Date,
        },
        startDate: {
          default: null,
          type: Date,
        },
        status: {
          default: CampaignStatus.TO_DO,
          enum: CampaignStatus,
          type: String,
        },
      },
    },
    counters: {
      default: {
        invitations: {
          EDITOR: 0,
          OWNER: 0,
          READER: 0,
          TOTAL: 0,
        },
        users: {
          EDITOR: 0,
          OWNER: 0,
          READER: 0,
          TOTAL: 0,
        },
      },
      type: {
        invitations: {
          EDITOR: { default: 0, type: Number },
          OWNER: { default: 0, type: Number },
          READER: { default: 0, type: Number },
          TOTAL: { default: 0, type: Number },
        },
        users: {
          EDITOR: { default: 0, type: Number },
          OWNER: { default: 0, type: Number },
          READER: { default: 0, type: Number },
          TOTAL: { default: 0, type: Number },
        },
      },
    },
    description: {
      default: null,
      type: String,
    },
    facebook: {
      default: null,
      type: String,
    },
    fax: {
      default: null,
      type: String,
    },
    // Linked invitations list
    invitations: [
      {
        ref: "Invitation",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    logo: {
      default: null,
      type: String,
    },
    mail: {
      index: true,
      default: null,
      lowercase: true,
      trim: true,
      type: String,
    },

    name: {
      index: true,
      required: true,
      type: String,
    },
    // ID as a number
    organization_id: {
      index: true,
      type: Number,
      unique: true,
    },
    phone: { default: null, type: PhoneSchema },
    // Places belonging to the organization
    places: [
      {
        ref: "Place",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    priority: {
      index: true,
      default: false,
      type: Boolean,
    },
    relations: {
      default: [],
      type: [{ enum: RELATIONS, type: String }],
    },
    territories: { default: [], type: [String] },

    users: [
      {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    verified: {
      date: { default: null, type: Date },
      status: { default: false, type: Boolean },
    },
    website: {
      default: null,
      type: String,
    },
    lastLogin: {
      default: null,
      type: Date,
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);

OrganizationSchema.index({ places: 1 }, { sparse: true });

export const OrganizationModel = model(
  "Organization",
  OrganizationSchema,
  "organization"
);

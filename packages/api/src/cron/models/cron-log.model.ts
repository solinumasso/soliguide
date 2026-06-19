import mongoose, { model } from "mongoose";

import { CronLogName, CronLogStatus } from "../enums";
import type { CronLog } from "../interfaces";

const CronLogSchema = new mongoose.Schema<CronLog>(
  {
    name: { enum: CronLogName, required: true, trim: true, type: String },

    status: {
      default: CronLogStatus.RUNNING,
      enum: CronLogStatus,
      required: true,
      type: String,
    },

    environment: { default: null, type: String },

    startedAt: { required: true, type: Date },

    finishedAt: { default: null, type: Date },

    durationMs: { default: null, type: Number },

    error: { default: null, trim: true, type: String },

    context: { default: {}, type: mongoose.Schema.Types.Mixed },
  },
  {
    strict: true,
    timestamps: true,
  }
);

// Metabase-oriented indexes: history per cron, status timeline, global timeline
CronLogSchema.index({ name: 1, startedAt: -1 });
CronLogSchema.index({ status: 1, startedAt: -1 });
CronLogSchema.index({ startedAt: -1 });

export const CronLogModel = model<CronLog>(
  "CronLog",
  CronLogSchema,
  "cronLogs"
);

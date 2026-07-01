import mongoose from "mongoose";

import { CONFIG } from "../../_models";
import { CronLogName, CronLogStatus } from "../enums";
import type { CronLogContext } from "../interfaces";
import { CronLogModel } from "../models/cron-log.model";

/**
 * Persist the start of a cron execution and return the created log id so the
 * wrapper can complete or fail it once the job is done.
 */
export const startCronLog = async (
  name: CronLogName
): Promise<mongoose.Types.ObjectId> => {
  const cronLog = await CronLogModel.create({
    name,
    context: {},
    status: CronLogStatus.RUNNING,
    environment: CONFIG.ENV,
    startedAt: new Date(),
  });

  return cronLog._id;
};

/**
 * Mark a cron execution as successful.
 */
export const completeCronLog = async (
  cronLogId: mongoose.Types.ObjectId,
  startedAt: Date,
  context: CronLogContext = {}
): Promise<void> => {
  const finishedAt = new Date();

  await CronLogModel.updateOne(
    { _id: cronLogId },
    {
      $set: {
        status: CronLogStatus.SUCCESS,
        finishedAt,
        durationMs: finishedAt.getTime() - startedAt.getTime(),
        context,
      },
    }
  );
};

/**
 * Mark a cron execution as failed and store the error message.
 */
export const failCronLog = async (
  cronLogId: mongoose.Types.ObjectId,
  startedAt: Date,
  error: unknown,
  context: CronLogContext = {}
): Promise<void> => {
  const finishedAt = new Date();
  const message = error instanceof Error ? error.message : String(error);

  await CronLogModel.updateOne(
    { _id: cronLogId },
    {
      $set: {
        status: CronLogStatus.FAILED,
        finishedAt,
        durationMs: finishedAt.getTime() - startedAt.getTime(),
        error: message,
        context,
      },
    }
  );
};

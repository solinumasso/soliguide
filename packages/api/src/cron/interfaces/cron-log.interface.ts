import type { CronLogName, CronLogStatus } from "../enums";

export type CronLogContext = Record<string, boolean | number | string | null>;

export interface CronJobResult {
  context?: CronLogContext;
}

export interface CronJobExecution {
  mergeContext: (context: CronLogContext) => void;
  setContext: (context: CronLogContext) => void;
}

/**
 * Document stored in the `cronLogs` collection. One document per cron execution.
 */
export interface CronLog {
  name: CronLogName;
  status: CronLogStatus;
  environment: string;
  startedAt: Date;
  finishedAt: Date | null;
  durationMs: number | null;
  error: string | null;
  context: CronLogContext;
}

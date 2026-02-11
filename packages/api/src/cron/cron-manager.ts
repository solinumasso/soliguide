import "../instrument";

import { CronJob } from "cron";
import * as Sentry from "@sentry/node";
import { logger } from "../general/logger";

import { setOfflineJob } from "./jobs/fiches/set-offline.job";
import { setIsOpenTodayJob } from "./jobs/fiches/set-isOpenToday.job";
import { setCurrentTempInfoJob } from "./jobs/fiches/set-current-temp-info.job";
import { unsetObsoleteTempInfoJob } from "./jobs/fiches/unset-obsolete-temp-info.job";

export const Schedule = {
  EVERY_MINUTE: "* * * * *",
  EVERY_5_MINUTES: "*/5 * * * *",
  EVERY_15_MINUTES: "*/15 * * * *",
  EVERY_30_MINUTES: "*/30 * * * *",
  EVERY_HOUR: "0 * * * *",
  EVERY_DAY_AT_MIDNIGHT: "0 0 * * *",
  EVERY_DAY_AT_1AM: "0 1 * * *",
  EVERY_DAY_AT_3AM: "0 3 * * *",
  EVERY_DAY_AT_4AM: "0 4 * * *",
  EVERY_DAY_AT_5AM: "0 5 * * *",
  EVERY_DAY_AT_6AM: "0 6 * * *",
  EVERY_MONDAY_AT_9AM: "0 9 * * 1",
  EVERY_WEEK: "0 0 * * 0",
  EVERY_MONTH: "0 0 1 * *",
} as const;

function createMonitoredCron(
  slug: string,
  schedule: string,
  jobFn: () => Promise<void>
) {
  const MonitoredCronJob = Sentry.cron.instrumentCron(CronJob, slug);

  MonitoredCronJob.from({
    cronTime: schedule,
    onTick: jobFn,
    start: true,
    timeZone: "Europe/Paris",
  });

  logger.info(`Cron registered: ${slug} (${schedule})`);
}

export function initializeCronJobs() {
  logger.info("Initializing cron jobs with Sentry monitoring");

  createMonitoredCron(
    "set-is-open-today",
    Schedule.EVERY_DAY_AT_1AM,
    setIsOpenTodayJob
  );
  createMonitoredCron("set-offline", Schedule.EVERY_DAY_AT_3AM, setOfflineJob);
  createMonitoredCron(
    "set-current-temp-info",
    Schedule.EVERY_DAY_AT_4AM,
    setCurrentTempInfoJob
  );
  createMonitoredCron(
    "unset-obsolete-temp-info",
    Schedule.EVERY_DAY_AT_5AM,
    unsetObsoleteTempInfoJob
  );

  logger.info("All cron jobs initialized successfully");
}

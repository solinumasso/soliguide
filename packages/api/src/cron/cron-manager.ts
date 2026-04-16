import "../instrument";
import * as Sentry from "@sentry/node";

import { CronJob } from "cron";
import { logger } from "../general/logger";
import { setCurrentTempInfoJob } from "./jobs/places/set-current-temp-info.job";
import { setIsOpenTodayJob } from "./jobs/places/set-isOpenToday.job";
import { setOfflineJob } from "./jobs/places/set-offline.job";
import { syncPlacesToAirtableJob } from "./jobs/places/sync-places-to-airtable.job";
// import { translateFieldsJob } from "./jobs/translations/translate-fields.job";
import { unsetObsoleteTempInfoJob } from "./jobs/places/unset-obsolete-temp-info.job";

export const Schedule = {
  EVERY_MINUTE: "* * * * *",
  EVERY_5_MINUTES: "*/5 * * * *",
  EVERY_10_MINUTES: "*/10 * * * *",
  EVERY_15_MINUTES: "*/15 * * * *",
  EVERY_30_MINUTES: "*/30 * * * *",
  EVERY_HOUR: "0 * * * *",
  EVERY_DAY_AT_MIDNIGHT: "0 0 * * *",
  EVERY_DAY_AT_1AM: "0 1 * * *",
  EVERY_DAY_AT_2AM: "0 2 * * *",
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
  jobFn: () => Promise<void>,
  maxRuntime?: number
) {
  const monitorConfig = {
    schedule: {
      type: "crontab" as const,
      value: schedule,
    },
    timezone: "Europe/Paris",
    checkinMargin: 5,
    maxRuntime: maxRuntime ?? 30,
  };

  CronJob.from({
    cronTime: schedule,
    onTick: async () => {
      await Sentry.withMonitor(
        slug,
        async () => {
          try {
            await jobFn();
          } catch (err) {
            logger.error(`[CRON] ${slug} failed`, err);
            throw err;
          }
        },
        monitorConfig
      );
    },
    start: true,
    timeZone: "Europe/Paris",
  });

  logger.info(`Cron registered: ${slug} (${schedule})`);
}

export function initializeCronJobs() {
  logger.info("Initializing cron jobs with Sentry monitoring");

  createMonitoredCron(
    "set-current-temp-info",
    Schedule.EVERY_DAY_AT_1AM,
    setCurrentTempInfoJob
  );

  createMonitoredCron(
    "unset-obsolete-temp-info",
    Schedule.EVERY_DAY_AT_2AM,
    unsetObsoleteTempInfoJob
  );

  createMonitoredCron(
    "set-is-open-today",
    Schedule.EVERY_DAY_AT_4AM,
    setIsOpenTodayJob
  );

  createMonitoredCron("set-offline", Schedule.EVERY_DAY_AT_3AM, setOfflineJob);

  createMonitoredCron(
    "sync-places-to-airtable",
    Schedule.EVERY_DAY_AT_5AM,
    syncPlacesToAirtableJob
  );

  // DEACTIVATED UNTIL FIXED
  // createMonitoredCron(
  //   "translate-fields",
  //   Schedule.EVERY_10_MINUTES,
  //   translateFieldsJob
  // );

  logger.info("All cron jobs initialized successfully");
}

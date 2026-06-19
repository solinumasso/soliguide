import { logger } from "../../../general/logger";
import { setIsOpenToday } from "../../../place/services/isOpenToday.service";
import type { CronJobExecution, CronJobResult } from "../../interfaces";

export async function setIsOpenTodayJob(
  execution?: CronJobExecution
): Promise<CronJobResult> {
  logger.info("JOB - SET IS_OPEN_TODAY FOR PLACES\tSTART");

  const result = await setIsOpenToday();
  const context = {
    placesProcessed: result.placesProcessed,
    placesSyncedToAirtable: result.placesSyncedToAirtable,
    servicesProcessed: result.servicesProcessed,
  };
  execution?.setContext(context);

  logger.info("JOB - SET IS_OPEN_TODAY FOR PLACES\tEND");

  return { context };
}

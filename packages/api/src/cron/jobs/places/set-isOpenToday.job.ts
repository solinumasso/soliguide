import { logger } from "../../../general/logger";
import { setIsOpenToday } from "../../../place/services/isOpenToday.service";

export async function setIsOpenTodayJob(): Promise<void> {
  logger.info("JOB - SET IS_OPEN_TODAY FOR PLACES\tSTART");

  await setIsOpenToday();

  logger.info("JOB - SET IS_OPEN_TODAY FOR PLACES\tEND");
}

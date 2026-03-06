
import "../../src/config/database/connection";
import { Db } from "mongodb";
import { logger } from "../../src/general/logger";
import { setIsOpenToday } from "../../src/place/services/isOpenToday.service";

const message = "Set isOpenToday for places and services";

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  await db
    .collection("lieux")
    .updateMany({ isOpenToday: true }, { $set: { isOpenToday: false } });

  await db
    .collection("lieux")
    .updateMany(
      { "services_all.isOpenToday": true },
      { $set: { "services_all.$[elem].isOpenToday": false } },
      { arrayFilters: [{ "elem.isOpenToday": true }] }
    );
};

export const up = async () => {
  logger.info("SET IS_OPEN_TODAY FOR PLACES\tSTART");

  await setIsOpenToday();

  logger.info("SET IS_OPEN_TODAY FOR PLACES\tEND");
};

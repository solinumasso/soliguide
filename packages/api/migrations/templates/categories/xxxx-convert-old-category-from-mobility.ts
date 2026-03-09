import { Db } from "mongodb";

import { logger } from "../../../src/general/logger";
import { Categories } from "@soliguide/common";

const message = "Migrate old mobility categories to new ones";

const categoryMapping: Record<string, Categories> = {
  carpooling: Categories.TRANSPORTATION_MOBILITY,
  provision_of_vehicles: Categories.PERSONAL_VEHICLE_ACCESS,
  chauffeur_driven_transport: Categories.TRANSPORTATION_MOBILITY,
  mobility_assistance: Categories.MOBILITY_FINANCING,
};
export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  for (const [oldCategory, newCategory] of Object.entries(categoryMapping)) {
    const result = await db.collection("lieux").updateMany(
      { "services_all.category": oldCategory },
      {
        $set: { "services_all.$[elem].category": newCategory },
      },
      {
        arrayFilters: [{ "elem.category": oldCategory }],
      }
    );
    logger.info(
      `Updated ${result.modifiedCount} documents: replaced category '${oldCategory}' with '${newCategory}'`
    );
  }
};

export const down = () => {
  logger.info("[ROLLBACK] - No rollback possible");
};

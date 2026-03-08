import { Db } from "mongodb";

import { logger } from "../../../src/general/logger";
import { Categories, CommonNewPlaceService } from "@soliguide/common";
import striptags from "striptags";

const message =
  "Migrate mobitlityAssistanceName specificField to funding_mobility.description";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const placesToUpdate = await db
    .collection("lieux")
    .find({
      services_all: {
        $elemMatch: {
          category: "mobility_financing",
        },
      },
    })
    .toArray();

  let migratedCount = 0;

  placesToUpdate.forEach((place) => {
    let modified = false;
    place.services_all = place.services_all.map(
      (service: CommonNewPlaceService) => {
        if (service.category === Categories.MOBILITY_FINANCING) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const specificField = (service?.categorySpecificFields as any)
            ?.mobilityAssistanceName;

          if (specificField) {
            service.description = service.description
              ? `${service.description}<p>${striptags(specificField)}</p>`
              : `<p>${striptags(specificField)}</p>`;

            migratedCount++;
            modified = true;
          }
        }
        return service;
      }
    );

    if (modified) {
      db.collection("lieux").updateOne(
        { _id: place._id },
        { $set: { services_all: place.services_all } }
      );
    }
  });

  logger.info(
    `[MIGRATION] - ${migratedCount} mobilityAssistanceName field migrated`
  );
};

export const down = () => {
  logger.info("[ROLLBACK] - No rollback possible");
};

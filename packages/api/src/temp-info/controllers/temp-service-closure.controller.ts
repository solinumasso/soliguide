import type { NextFunction } from "express";

import { type ApiPlace, TempInfoType } from "@soliguide/common";

import {
  deleteTempServiceClosureWithParams,
  insertNewTempServiceClosure,
} from "../services/temp-service-closure.service";
import type {
  ExpressRequest,
  ExpressResponse,
  ModelWithId,
} from "../../_models";
import { findTempInfoWithParams } from "../services/temp-info.service";

export const rebuildTempServiceClosure = async (
  req: ExpressRequest,
  _res: ExpressResponse,
  next: NextFunction
): Promise<void> => {
  const place: ModelWithId<ApiPlace> | null =
    req.updatedPlace ?? req.placeDeleted ?? null;
  if (place) {
    // First we delete all temporary service closures associated to this place
    await deleteTempServiceClosureWithParams({ place: place._id });

    // Then we rebuild all the temporary service closures that are relevant
    const tempClosuresOnPlace = await findTempInfoWithParams({
      place: place._id,
      tempInfoType: {
        $in: [TempInfoType.CLOSURE, TempInfoType.SERVICE_CLOSURE],
      },
    });

    for (const closure of tempClosuresOnPlace) {
      if (closure.tempInfoType === TempInfoType.SERVICE_CLOSURE) {
        if (!closure.serviceObjectId) {
          req.log.error(`Service closure ${closure._id} has no service!`);
          continue;
        }
        await insertNewTempServiceClosure({
          startDate: closure.dateDebut,
          endDate: closure.dateFin,
          nbDays: closure.nbDays,
          place: place._id,
          serviceObjectId: closure.serviceObjectId,
        });
      } else {
        for (const service of place.services_all) {
          await insertNewTempServiceClosure({
            startDate: closure.dateDebut,
            endDate: closure.dateFin,
            nbDays: closure.nbDays,
            place: place._id,
            serviceObjectId: service.serviceObjectId,
          });
        }
      }
    }
  }

  next();
};

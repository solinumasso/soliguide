import { Injectable } from "@nestjs/common";

import { SearchContext, SearchQueryBuilder } from "./search.query-builder";
import { mergeServiceElemMatchCondition } from "./utils";

@Injectable()
export class ModalitiesQueryBuilder implements SearchQueryBuilder {
  build(context: SearchContext): SearchContext {
    const modalities = context.query.modalities;

    if (!modalities || typeof modalities !== "object") {
      return context;
    }

    const modalitiesFields: Record<string, unknown> = {};

    if (typeof modalities.isUnconditional === "boolean") {
      modalitiesFields["modalities.inconditionnel"] = modalities.isUnconditional;
    }

    for (const [queryKey, mongoField] of Object.entries(MODALITIES_FIELD_MAP)) {
      const value = modalities[queryKey as keyof typeof modalities];

      if (typeof value === "boolean") {
        modalitiesFields[mongoField] = value;
      }
    }

    if (!Object.keys(modalitiesFields).length) {
      return context;
    }

    return mergeServiceElemMatchCondition(context, modalitiesFields);
  }
}

const MODALITIES_FIELD_MAP = {
  acceptsPets: "modalities.animal.checked",
  isAppointmentRequired: "modalities.appointment.checked",
  isRegistrationRequired: "modalities.inscription.checked",
  isOrientationRequired: "modalities.orientation.checked",
  hasWeelchairAccess: "modalities.pmr.checked",
  isPaid: "modalities.price.checked",
  sign: "modalities.sign.checked",
} as const;

import { Injectable } from "@nestjs/common";
import { WelcomedPublics } from "@soliguide/common";

import { SearchContext, SearchQueryBuilder } from "./search.query-builder";
import { mergeServiceElemMatchCondition } from "./utils";

const ADMISSION_POLICY_TO_WELCOMED_PUBLICS = {
  open: WelcomedPublics.UNCONDITIONAL,
  restricted: WelcomedPublics.PREFERENTIAL,
  targeted: WelcomedPublics.EXCLUSIVE,
} as const;

@Injectable()
export class AudienceQueryBuilder implements SearchQueryBuilder {
  build(context: SearchContext): SearchContext {
    const audiences = context.query.audiences;

    if (!audiences) {
      return context;
    }

    const audienceFields: Record<string, unknown> = {};

    if (audiences.admissionPolicy) {
      audienceFields["publics.accueil"] =
        ADMISSION_POLICY_TO_WELCOMED_PUBLICS[audiences.admissionPolicy];
    }

    if (audiences.age && audiences.age > 0 && audiences.age < 99) {
      audienceFields["publics.age.min"] = { $lte: audiences.age };
      audienceFields["publics.age.max"] = { $gte: audiences.age };
    }

    if (audiences.genders.length) {
      audienceFields["publics.gender"] = { $in: audiences.genders };
    }

    if (audiences.administrativeStatuses.length) {
      audienceFields["publics.administrative"] = {
        $in: audiences.administrativeStatuses,
      };
    }

    if (audiences.familyStatuses.length) {
      audienceFields["publics.familialle"] = { $in: audiences.familyStatuses };
    }

    if (audiences.otherStatuses.length) {
      audienceFields["publics.other"] = { $in: audiences.otherStatuses };
    }

    if (!Object.keys(audienceFields).length) {
      return context;
    }

    return mergeServiceElemMatchCondition(context, audienceFields);
  }
}

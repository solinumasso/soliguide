import { RootQuerySelector } from "mongoose";

import { ApiPlace } from "@soliguide/common";

export const cleanSearchQuery = (nosqlQuery: RootQuerySelector<ApiPlace>) => {
  let needsToBecleand = true;

  while (needsToBecleand) {
    needsToBecleand = false;

    if (Object.prototype.hasOwnProperty.call(nosqlQuery, "$or")) {
      const metConditions: string[] = [];

      if (!nosqlQuery.$or) {
        delete nosqlQuery.$or;
      } else if (nosqlQuery.$or.length > 1) {
        for (let i = 0; i < nosqlQuery.$or.length; i++) {
          if (Object.prototype.hasOwnProperty.call(nosqlQuery.$or[i], "$and")) {
            if (
              nosqlQuery.$or[i].$and!.length <= 1 // skipcq: JS-0339
            ) {
              if (
                nosqlQuery.$or[i].$and!.length && // skipcq: JS-0339
                !metConditions.includes(
                  JSON.stringify(
                    nosqlQuery.$or[i].$and![0] // skipcq: JS-0339
                  )
                )
              ) {
                nosqlQuery.$or[i] = nosqlQuery.$or[i].$and![0]; // skipcq: JS-0339
              } else {
                nosqlQuery.$or.splice(i, 1);
              }
              needsToBecleand = true;
            }
          } else {
            metConditions.push(JSON.stringify(nosqlQuery.$or[i]));
          }
        }
      } else if (nosqlQuery.$or.length === 1) {
        const key = Object.keys(nosqlQuery.$or[0])[0];
        nosqlQuery[key] = nosqlQuery.$or[0][key];
        delete nosqlQuery.$or;
      } else {
        delete nosqlQuery.$or;
      }
    }

    if (
      Object.prototype.hasOwnProperty.call(nosqlQuery, "services_all") &&
      Object.prototype.hasOwnProperty.call(
        nosqlQuery.services_all,
        "$elemMatch"
      ) &&
      !Object.keys(nosqlQuery.services_all.$elemMatch).length
    ) {
      delete nosqlQuery.services_all;
    }
  }
};

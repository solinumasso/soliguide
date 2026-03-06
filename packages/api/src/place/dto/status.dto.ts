import { isDraftAndFormUncomplete, PlaceStatus } from "@soliguide/common";

import { body, Meta } from "express-validator";

export const statusDto = [
  body("status")
    .isIn(Object.values(PlaceStatus))
    .custom((status: PlaceStatus, { req }: Meta) => {
      if (status === PlaceStatus.ONLINE) {
        if (isDraftAndFormUncomplete(req.lieu)) {
          throw new Error(`Place uncompleted`);
        }
      }
      return true;
    }),
];

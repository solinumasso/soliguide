import {
  CommonDayOpeningHours,
  CommonOpeningHours,
  PlaceClosedHolidays,
} from "@soliguide/common";
import mongoose from "mongoose";
import { DayOpeningHoursSchema } from "./day-opening-hours";
import { ModelWithId } from "../../_models/mongo";

export const OpeningHoursSchema = new mongoose.Schema<
  ModelWithId<CommonOpeningHours>
>(
  {
    closedHolidays: {
      default: PlaceClosedHolidays.UNKNOWN,
      enum: PlaceClosedHolidays,
      type: String,
    },
    description: {
      default: null,
      trim: true,
      type: String,
    },
    friday: {
      default: new CommonDayOpeningHours(),
      required: true,
      type: DayOpeningHoursSchema,
    },
    monday: {
      default: new CommonDayOpeningHours(),
      required: true,
      type: DayOpeningHoursSchema,
    },
    saturday: {
      default: new CommonDayOpeningHours(),
      required: true,
      type: DayOpeningHoursSchema,
    },
    sunday: {
      default: new CommonDayOpeningHours(),
      required: true,
      type: DayOpeningHoursSchema,
    },
    thursday: {
      default: new CommonDayOpeningHours(),
      required: true,
      type: DayOpeningHoursSchema,
    },
    tuesday: {
      default: new CommonDayOpeningHours(),
      required: true,
      type: DayOpeningHoursSchema,
    },
    wednesday: {
      default: new CommonDayOpeningHours(),
      required: true,
      type: DayOpeningHoursSchema,
    },
  },
  {
    strict: true,
    _id: false,
  }
);

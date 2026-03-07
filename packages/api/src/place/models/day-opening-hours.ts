import mongoose from "mongoose";
import { CommonDayOpeningHours, CommonTimeslot } from "@soliguide/common";
import { SubSchemaId } from "../../_models";

const timeslotSchema = new mongoose.Schema<SubSchemaId<CommonTimeslot>>(
  {
    end: {
      default: null,
      required: true,
      type: Number,
    },

    start: {
      default: null,
      required: true,
      type: Number,
    },
  },
  { _id: false }
);

export const DayOpeningHoursSchema = new mongoose.Schema<
  SubSchemaId<CommonDayOpeningHours>
>(
  {
    open: {
      default: false,
      required: true,
      type: Boolean,
    },

    timeslot: {
      default: [],
      type: [timeslotSchema],
    },
  },
  {
    strict: true,
    _id: false,
  }
);

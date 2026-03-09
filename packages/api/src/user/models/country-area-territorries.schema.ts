import { CountryAreaTerritories } from "@soliguide/common";
import { Schema } from "mongoose";

export const CountryAreaTerritoriesSchema = new Schema<
  CountryAreaTerritories<any>
>(
  {
    departments: {
      type: [String],
      default: [],
    },
    regions: {
      type: [String],
      default: [],
    },
    cities: {
      type: [
        {
          city: String,
          department: String,
        },
      ],
      default: [],
    },
  },
  { _id: false }
);

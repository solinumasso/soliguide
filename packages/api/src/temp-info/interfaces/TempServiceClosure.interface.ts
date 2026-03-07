import { ObjectId } from "mongodb";

export interface TempServiceClosure {
  _id?: ObjectId;
  // Date range
  startDate: Date;
  endDate: Date | null;
  nbDays: number | null;
  // Link to
  place: ObjectId;
  serviceObjectId: ObjectId;
  // Is created during a campaign period
  campaign: string | null;
}

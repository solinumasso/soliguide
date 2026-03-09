import { Types } from "mongoose";

import { TempInfoStatus, TempInfoType } from "@soliguide/common";

import type { UpComingTempInfo } from "../../../types";
import type { TempInfo } from "../../../../temp-info/types";

const commonPartialTempInfo = {
  hours: null,
  name: null,
  place: new Types.ObjectId(),
  placeId: 33268,
  serviceObjectId: null,
  tempInfoType: TempInfoType.CLOSURE,
};

export const TEMP_INFO_MOCK: UpComingTempInfo = [
  {
    placeId: 33268,
    tempInfo: [
      {
        ...commonPartialTempInfo,
        _id: new Types.ObjectId(),
        dateDebut: new Date("2023-06-15T00:00:00.000Z"),
        dateFin: new Date("2023-06-30T23:59:59.000Z"),
        description: "<p>First closure for works</p>",
        nbDays: 16,
        status: TempInfoStatus.CURRENT,

        createdAt: new Date("2023-06-26T09:23:56.306Z"),
        updatedAt: new Date("2023-06-26T09:37:18.656Z"),
      },
      {
        ...commonPartialTempInfo,
        _id: new Types.ObjectId(),
        dateDebut: new Date("2023-07-02T00:00:00.000Z"),
        dateFin: new Date("2023-07-11T23:59:59.000Z"),
        description: "<p>Second closure following a strike</p>",
        nbDays: 10,
        status: TempInfoStatus.CURRENT,
        createdAt: new Date("2023-06-26T09:24:10.123Z"),
        updatedAt: new Date("2023-06-26T09:37:35.318Z"),
      },
      {
        ...commonPartialTempInfo,
        _id: new Types.ObjectId(),
        dateDebut: new Date("2023-07-14T00:00:00.000Z"),
        dateFin: new Date("2023-07-14T23:59:59.000Z"),
        description: "<p>Third closing for July 14, public holiday</p>",
        nbDays: 1,
        status: TempInfoStatus.FUTURE,
        createdAt: new Date("2023-06-26T09:24:29.974Z"),
        updatedAt: new Date("2023-06-26T09:37:51.503Z"),
      },
    ],
  },
];

export const MULTIPLE_TEMP_INFO_MOCK: TempInfo[] = [
  {
    dateDebut: new Date("2022-09-01T01:00:00.000Z"),
    dateFin: new Date("2022-11-06T00:00:00.000Z"),
    description: "A fake temp hours",
    hours: {
      description: "A fake temp hours",
      friday: {
        open: false,
        timeslot: [],
      },
      monday: {
        open: false,
        timeslot: [],
      },
      saturday: {
        open: false,
        timeslot: [],
      },
      sunday: {
        open: false,
        timeslot: [],
      },
      thursday: {
        open: false,
        timeslot: [],
      },
      tuesday: {
        open: false,
        timeslot: [],
      },
      wednesday: {
        open: false,
        timeslot: [],
      },
    },
    name: null,
    nbDays: 16,
    placeId: 33,
    tempInfoType: TempInfoType.HOURS,
  } as unknown as TempInfo,
  {
    dateDebut: new Date("2022-09-01T01:00:00.000Z"),
    dateFin: new Date("2022-11-06T00:00:00.000Z"),
    description: null,
    name: "A fake temp closure",
    hours: null,
    nbDays: 5,
    placeId: 33268,
    tempInfoType: TempInfoType.CLOSURE,
  } as unknown as TempInfo,
  {
    dateDebut: new Date("2022-09-01T01:00:00.000Z"),
    dateFin: new Date("2022-11-06T00:00:00.000Z"),
    description: null,
    name: "A fake temp message",
    placeId: 33,
    tempInfoType: TempInfoType.MESSAGE,
  } as unknown as TempInfo,
];

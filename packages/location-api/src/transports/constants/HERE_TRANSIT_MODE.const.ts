import { StopPointMode } from "@soliguide/common";
import { HereTransitMode } from "../types/here-transit-mode.type";

export const HERE_TRANSIT_MODE: { [key in HereTransitMode]?: StopPointMode } = {
  bus: StopPointMode.BUS,
  busRapid: StopPointMode.TRAIN,
  cityTrain: StopPointMode.TRAIN,
  highSpeedTrain: StopPointMode.TRAIN,
  intercityTrain: StopPointMode.TRAIN,
  interRegionalTrain: StopPointMode.TRAIN,
  lightRail: StopPointMode.TRAMWAY,
  monorail: StopPointMode.TRAIN,
  privateBus: StopPointMode.BUS,
  regionalTrain: StopPointMode.TRAIN,
  subway: StopPointMode.SUBWAY,
};

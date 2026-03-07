import { PairingSources } from "../enums";
import { ApiPlace, CommonPlaceSource } from "../../place";
import {
  EXTERNAL_UPDATES_ONLY_SOURCES,
  SOURCES_DISPLAY_EXTERNAL_LINK,
  SOURCES_TO_DISPLAY,
} from "../constants";
import { ExternalSourceToDisplay } from "../types";

export const checkIfSourceMustBeDisplayed = (
  sourceName: string,
  isOrigin: boolean
): boolean =>
  EXTERNAL_UPDATES_ONLY_SOURCES.includes(sourceName as PairingSources) ||
  (SOURCES_TO_DISPLAY.includes(sourceName as ExternalSourceToDisplay) &&
    isOrigin);

export const isFromExternalSource = (place: ApiPlace): boolean => {
  if (!place.sources) {
    return false;
  }

  return place.sources.some((source) =>
    checkIfSourceMustBeDisplayed(source.name, source.isOrigin)
  );
};

export const getSourceUrl = (source: CommonPlaceSource): string => {
  if (SOURCES_DISPLAY_EXTERNAL_LINK.includes(source.name as PairingSources)) {
    return source.ids.find((id) => id?.url)?.url ?? "";
  }
  return "";
};

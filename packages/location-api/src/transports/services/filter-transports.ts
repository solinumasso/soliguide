import { slugString, Station } from "@soliguide/common";
import { HereTransportStation } from "../interfaces/here-station.interface";
import { HERE_TRANSIT_MODE } from "../constants/HERE_TRANSIT_MODE.const";

const EXCLUDED_TRANSPORT_NAMES = [
  "blablacar",
  "ouibus",
  "flixbus",
  "noctilien",
  "tgv",
];

const EXCLUDED_TRANSPORT_MODES = [
  "highSpeedTrain",
  "intercityTrain",
  "interRegionalTrain",
  "regionalTrain",
  "ferry",
  "flight",
  "aerial",
  "monorail",
  "privateBus",
];

const isExcludedTransport = (name: string): boolean => {
  const normalizedName = slugString(name);
  return EXCLUDED_TRANSPORT_NAMES.some((excluded) =>
    normalizedName.includes(excluded)
  );
};

const isExcludedMode = (mode: string): boolean => {
  return EXCLUDED_TRANSPORT_MODES.includes(mode);
};

export const filterTransports = (
  stations: HereTransportStation[]
): Station[] => {
  const processedStations = new Map<string, Station>();

  for (const station of stations ?? []) {
    const filteredTransports = station.transports?.filter(
      (transport) =>
        !isExcludedTransport(transport.name) && !isExcludedMode(transport.mode)
    );

    if (!filteredTransports?.length) {
      continue;
    }

    const placeName = station.place.name;

    let currentStation = processedStations.get(placeName);

    if (!currentStation) {
      currentStation = {
        place: station.place,
        transports: {},
      };
      processedStations.set(placeName, currentStation);
    }

    for (const transport of filteredTransports) {
      const mode = HERE_TRANSIT_MODE[transport.mode];

      if (!currentStation.transports[mode]) {
        currentStation.transports[mode] = [];
      }

      const alreadyExists = currentStation.transports[mode].some(
        (t) => t.name === transport.name
      );

      if (!alreadyExists) {
        currentStation.transports[mode].push({
          name: transport.name,
          color: transport.color,
          textColor: transport.textColor,
          headsign: transport.headsign,
          mode,
        });
      }
    }
  }

  return Array.from(processedStations.values());
};

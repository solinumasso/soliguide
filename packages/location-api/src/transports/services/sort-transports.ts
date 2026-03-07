import { Station } from "@soliguide/common";
import { HereTransportStation } from "../interfaces/here-station.interface";
import { HERE_TRANSIT_MODE } from "../constants/HERE_TRANSIT_MODE.const";

export const sortTransports = (stations: HereTransportStation[]): Station[] => {
  const processedStations = new Map<string, Station>();
  const validStations = stations.filter(
    (station) => station?.transports?.length
  );

  for (const station of validStations) {
    const placeName = station.place.name;

    if (!processedStations.has(placeName)) {
      processedStations.set(placeName, {
        place: station.place,
        transports: {},
      });
    }

    const currentStation = processedStations.get(placeName)!;

    for (const transport of station.transports) {
      const mode = HERE_TRANSIT_MODE[transport.mode];
      if (!currentStation.transports[mode]) {
        currentStation.transports[mode] = [];
      }

      const existingTransport = currentStation.transports[mode].find(
        (t) => t.name === transport.name
      );

      if (!existingTransport) {
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

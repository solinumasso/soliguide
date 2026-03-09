// Doc: https://www.here.com/docs/bundle/intermodal-routing-api-developer-guide/page/concepts/modes.html

export type HereTransitMode =
  | "highSpeedTrain" //	High-speed trains
  | "intercityTrain" //	Intercity/EuroCity trains
  | "interRegionalTrain" //	Inter-regional and fast trains
  | "regionalTrain" //	Regional and other trains
  | "cityTrain" //	City trains
  | "bus" //	Buses
  | "ferry" //	Boats/Ferries
  | "subway" //	Metros/Subways
  | "lightRail" //	Trams
  | "privateBus" //	Ordered services/Taxis
  | "inclined" //	Inclined/Funiculars
  | "aerial" //	Aerials/Cable cars
  | "busRapid" //	Rapid buses
  | "monorail" //	Monorails
  | "flight" //	Airplanes
  | "walk" //	Walk
  | "car" //	Car
  | "bicycle"; //	Bicycle

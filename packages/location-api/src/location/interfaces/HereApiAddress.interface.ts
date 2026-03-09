import { HereApiLocalityType, HereApiResultType } from "../types";

export type HereApiAddress = {
  title: string;
  id: string;
  resultType: HereApiResultType;
  localityType: HereApiLocalityType;
  address: {
    label: string;
    countryCode: string;
    countryName: string;
    stateCode: string;
    postalCode: string;
    state: string;
    county: string;
    city: string;
    street: string;
  };
  position: {
    lat: number;
    lng: number;
  };
  mapView: {
    west: number;
    south: number;
    east: number;
    north: number;
  };
  scoring: {
    queryScore: number;
    fieldScore: {
      streets: number[];
    };
  };
};

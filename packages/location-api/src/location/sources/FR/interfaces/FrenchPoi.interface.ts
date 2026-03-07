import { FeatureCollection, Point } from "geojson";
import { FrenchAddress } from "./FrenchAddress.interface";
import { PoiCategory } from "../types";

// Poi = Point of Interest
export interface FrenchPoi {
  id: string;
  score: number;
  type?: string;
  toponym: string;
  name: string[];
  category: PoiCategory[];
  postcode: string[];
  citycode: string[];
  city: string[];
  extrafields?: {
    population: string;
    status?: string;
    codes_insee_des_communes_membres: string[];
  };
}

export type FrenchApiPoiResponse = FeatureCollection<
  Point,
  FrenchPoi & FrenchAddress
>;

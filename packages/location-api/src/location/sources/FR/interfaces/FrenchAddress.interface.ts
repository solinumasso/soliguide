import { FeatureCollection, Point } from "geojson";
import { FrenchAddressType, PoiCategory } from "../types";

export interface FrenchAddress {
  id: string;
  type: FrenchAddressType;
  score: number;
  housenumber?: string;
  name?: string;
  postcode: string;
  citycode: string;
  city: string;
  district?: string;
  category?: PoiCategory[];
  oldcitycode?: string;
  oldcity?: string;
  context: string;
  label: string;
  x: number;
  y: number;
  importance: number;
}

export type FrenchApiAddressResponse = FeatureCollection<Point, FrenchAddress>;

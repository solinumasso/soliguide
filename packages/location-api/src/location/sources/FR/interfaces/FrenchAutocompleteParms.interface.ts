import { FrenchAddressType, PoiCategory } from "../types";

export interface FrenchAutocompleteParams {
  q?: string;
  limit: number;
  // - 'poi' for research in place and administrative unit
  // - 'address' for search by address
  // You can combine "poi,address"
  index: string;
  lat?: number; // Latitude of a locally to promote the nearest candidates.
  lon?: number; // Longitude of a locally to promote the nearest candidates.
  category?: PoiCategory;
  type?: FrenchAddressType;
}

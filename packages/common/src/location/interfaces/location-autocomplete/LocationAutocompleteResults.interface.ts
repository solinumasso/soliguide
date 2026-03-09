import { LocationAutoCompleteAddress } from "./LocationAutoCompleteAddress.interface";

export interface LocationAutoCompleteResults {
  countries: LocationAutoCompleteAddress[];
  regions: LocationAutoCompleteAddress[];
  departments: LocationAutoCompleteAddress[];
  cities: LocationAutoCompleteAddress[];
  addresses: LocationAutoCompleteAddress[];
}

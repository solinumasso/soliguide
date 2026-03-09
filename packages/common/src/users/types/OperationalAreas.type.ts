import { SoliguideCountries } from "../../location";
import { CountryAreaTerritories } from "../classes/CountryAreaTerritories.class";

// It's a type, not an interface
// A mapped type may not declare properties or methods - TypeScript
export type OperationalAreas = {
  [key in SoliguideCountries]?: CountryAreaTerritories<SoliguideCountries>;
};

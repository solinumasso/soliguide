import { ApiPlace } from "../../place";

export interface ApiSearchResults {
  nbResults: number;
  places: ApiPlace[];
}

import { Phone } from "../../phone";

export interface PlaceContact {
  lastname: string;
  mail: string;
  name: string;
  phone: Phone | null;
  title: string | null;
}

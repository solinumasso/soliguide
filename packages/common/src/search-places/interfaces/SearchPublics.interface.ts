import type {
  PublicsAdministrative,
  PublicsFamily,
  PublicsGender,
  PublicsOther,
  WelcomedPublics,
} from "../../publics/enums";

export interface SearchPublics {
  accueil?: WelcomedPublics;
  administrative?: PublicsAdministrative[];
  age?: number;
  familialle?: PublicsFamily[];
  gender?: PublicsGender[];
  other?: PublicsOther[];
}

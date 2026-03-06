import {
  ADMINISTRATIVE_DEFAULT_VALUES,
  FAMILY_DEFAULT_VALUES,
  GENDER_DEFAULT_VALUES,
  OTHER_DEFAULT_VALUES,
} from "../constants";
import {
  PublicsAdministrative,
  PublicsFamily,
  PublicsGender,
  PublicsOther,
  WelcomedPublics,
} from "../enums";

export class Publics {
  public accueil: WelcomedPublics;

  public description: string | null;

  public administrative: PublicsAdministrative[];
  public familialle: PublicsFamily[];
  public gender: PublicsGender[];
  public other: PublicsOther[];

  public age: { max: number; min: number };
  public showAge?: boolean;

  constructor(publics?: Partial<Publics>) {
    this.accueil = publics?.accueil ?? WelcomedPublics.UNCONDITIONAL;

    this.description = publics?.description ?? null;

    this.administrative = publics?.administrative?.length
      ? publics.administrative
      : ADMINISTRATIVE_DEFAULT_VALUES;
    this.familialle = publics?.familialle?.length
      ? publics.familialle
      : FAMILY_DEFAULT_VALUES;
    this.gender = publics?.gender?.length
      ? publics.gender
      : GENDER_DEFAULT_VALUES;
    this.other = publics?.other?.length ? publics.other : OTHER_DEFAULT_VALUES;

    this.age = publics?.age ?? { max: 99, min: 0 };

    if (this.age.max !== 99 || this.age.min !== 0) {
      this.showAge = true;
    }
  }
}

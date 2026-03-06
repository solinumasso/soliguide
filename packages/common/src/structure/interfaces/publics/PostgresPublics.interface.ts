import type {
  PostgresPublicsAdministrative,
  PostgresPublicsFamily,
  PostgresPublicsGender,
  PostgresPublicsOther,
} from ".";

export interface PostgresPublics {
  id: string;
  reception: number;
  age_min: number;
  age_max: number;
  description: string | null;
  show_age?: boolean;
  administrative: PostgresPublicsAdministrative;
  family: PostgresPublicsFamily;
  gender: PostgresPublicsGender;
  other: PostgresPublicsOther;
}

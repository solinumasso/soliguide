export interface PostgresPhone {
  index: number;
  id: string;
  number: string;
  label?: string;
  country_code: string;
  is_special: boolean;
}

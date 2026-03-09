import type { PostgresPhone } from ".";

export interface PostgresEntity {
  id: string;
  facebook?: string;
  fax?: string;
  instagram?: string;
  email?: string;
  name?: string;
  website?: string;
  phones: PostgresPhone[];
}

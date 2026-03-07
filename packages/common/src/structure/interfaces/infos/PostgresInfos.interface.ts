import type { PostgresEntity } from ".";

export interface PostgresInfos {
  id: string;
  name: string;
  description: string;
  entity: PostgresEntity;
}

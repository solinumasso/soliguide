import { PostgresModalitiesPrecisions } from ".";

export interface PostgresModalities {
  id: string;
  unconditional: boolean;
  appointment: boolean;
  membership: boolean;
  orientation: boolean;
  price: boolean;
  animal: boolean;
  prm: boolean;
  other?: string;
  precisions: PostgresModalitiesPrecisions;
}

import { type ServiceSaturation } from "../../../services";

export interface PostgresServiceSaturation {
  id: string;
  precision: string | null;
  status: ServiceSaturation;
}

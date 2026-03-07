import type { ExpressRequest } from "./ExpressRequest.interface";

export interface ValidatedBodyExpressRequest<T extends object>
  extends ExpressRequest {
  validatedBody: T;
}

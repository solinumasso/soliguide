import { RegistrationScheme, RegistrationScope } from "../enums";

export interface Registration {
  value: string;
  scope: RegistrationScope;
}

/**
 * Stored as a Mongoose Map on the API side, serialized as a plain object
 */
export type Registrations = Partial<Record<RegistrationScheme, Registration>>;

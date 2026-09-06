/**
 * What the identifier designates:
 * - ESTABLISHMENT: this very place has its own identifier
 * - ORGANIZATION: the identifier of the head office / parent body, shared by several places
 * - HOST: the identifier of the place hosting a service which has none of its own
 */
export enum RegistrationScope {
  ESTABLISHMENT = "establishment",
  ORGANIZATION = "organization",
  HOST = "host",
}

export const REGISTRATION_SCOPES: RegistrationScope[] =
  Object.values(RegistrationScope);

export const DEFAULT_REGISTRATION_SCOPE = RegistrationScope.ORGANIZATION;

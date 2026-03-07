
type Action = "EDIT" | "SEARCH" | "SEND" | "RESEND" | "UPDATE" | "VIEW"; // Later on to add "DELETE" | "SHARE" ...
type Feature =
  | "CAMPAIGN_EMAIL"
  | "CAMPAIGN_EMAIL_STATUS"
  | "WELCOME_EMAIL"
  | "CONTACT_EMAIL"
  | "INVITATION_EMAIL"
  | "PASSWORD_RESET_EMAIL"
  | "PLACE"
  | "PLACES"
  | "RESET_PASSWORD_LINK_EMAIL";
type TrackedEvent = `API_${Action}_${Feature}`;

export type TrackedEvents = { [T in TrackedEvent]?: Lowercase<T> };

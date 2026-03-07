
import { TrackedEvents } from "../types";

export const TRACKED_EVENTS = {
  API_SEARCH_PLACES: "api_search_places",
  API_SEND_CAMPAIGN_EMAIL: "api_send_campaign_email",
  API_SEND_WELCOME_EMAIL: "api_send_welcome_email",
  API_SEND_CONTACT_EMAIL: "api_send_contact_email",
  API_SEND_INVITATION_EMAIL: "api_send_invitation_email",
  API_RESEND_INVITATION_EMAIL: "api_resend_invitation_email",
  API_SEND_PASSWORD_RESET_EMAIL: "api_send_password_reset_email",
  API_SEND_RESET_PASSWORD_LINK_EMAIL: "api_send_reset_password_link_email",
} satisfies TrackedEvents;

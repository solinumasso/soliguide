import { AmqpSynchroUserEvent } from "./AmqpSynchroUserEvent.class";

/**
 * Brevo-specific user synchro event.
 *
 * Extends the shared {@link AmqpSynchroUserEvent} (published as-is to the
 * Airtable queue) with attributes only the Brevo CRM needs. Keeping them here
 * rather than on the shared event guarantees the Airtable payload stays free of
 * Brevo concerns.
 */
export class AmqpSynchroBrevoUserEvent extends AmqpSynchroUserEvent {
  /**
   * Number of active places (ONLINE/OFFLINE) the user holds VERIFIED rights on.
   * Feeds the Brevo `PLACES_COUNT` attribute. Set by the Brevo event builder in
   * real time and by the one-shot backfill; replaces the former Airtable count
   * of the n8n workflow.
   */
  public placesCount?: number;
}

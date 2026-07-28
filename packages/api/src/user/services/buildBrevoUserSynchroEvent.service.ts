import type {
  AmqpSynchroBrevoUserEvent,
  AmqpSynchroUserEvent,
} from "../../events";
import { findActiveLieuIds } from "../../place/services/place.service";
import { getVerifiedPlaceIds } from "./userRights.service";

/**
 * Brevo-specific decorator over a base user synchro event.
 *
 * Takes the event already built by `buildUserSynchroEvent` (shared with the
 * Airtable sync) and returns a Brevo variant enriched with `placesCount`,
 * WITHOUT mutating the base event so the Airtable payload stays untouched.
 *
 * `placesCount` is the number of active places (ONLINE/OFFLINE) the user holds
 * VERIFIED rights on. It replaces the Airtable-based count of the legacy n8n
 * workflow. Skipped for deletions, where the contact is removed and the count
 * is irrelevant.
 */
export const buildBrevoUserSynchroEvent = async (
  baseEvent: AmqpSynchroUserEvent,
  { isDeleted = false }: { isDeleted?: boolean } = {}
): Promise<AmqpSynchroBrevoUserEvent> => {
  // Shallow clone: never mutate the base event published as-is to Airtable.
  const brevoEvent = { ...baseEvent } as AmqpSynchroBrevoUserEvent;

  if (!isDeleted) {
    const verifiedPlaceIds = getVerifiedPlaceIds(baseEvent.rights);
    brevoEvent.placesCount = (await findActiveLieuIds(verifiedPlaceIds)).length;
  }

  return brevoEvent;
};

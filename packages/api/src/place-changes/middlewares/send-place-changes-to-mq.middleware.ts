import type { ApiPlace } from "@soliguide/common";

import type { ExpressRequest, ModelWithId } from "../../_models";
import {
  AmqpPlaceChangesEvent,
  AmqpSynchroAirtablePlaceEvent,
  RoutingKey,
  amqpEventsSender,
  Exchange,
  synchroAtDebounceQueue,
} from "../../events";
import type { PlaceChanges } from "../interfaces/PlaceChanges.interface";

export const sendPlaceChangesToMq = async (
  req: ExpressRequest & {
    placeChanges: PlaceChanges;
    updatedPlace: ModelWithId<ApiPlace>;
  }
) => {
  if (req.placeChanges) {
    const payload = new AmqpPlaceChangesEvent(
      req.placeChanges,
      req.updatedPlace,
      req.requestInformation.frontendUrl,
      req.requestInformation.theme
    );
    const key = req.placeChanges?.section === "new" ? "new" : "update";
    await amqpEventsSender.sendToQueue<AmqpPlaceChangesEvent>(
      Exchange.PLACE_CHANGES,
      `${RoutingKey.PLACE_CHANGES}.${req.placeChanges.placeType}.${key}`,
      payload,
      req.log
    );
  }

  if (req.updatedPlace) {
    const payload = new AmqpSynchroAirtablePlaceEvent(
      req.updatedPlace,
      req.requestInformation.frontendUrl,
      req.requestInformation.theme,
      req.isPlaceDeleted
    );

    // Debounced: if several events arrive for the same lieu_id within 1 minute,
    // only the last one is sent — prevents STARTED from overwriting FINISHED
    // when the campaign form sections are submitted in quick succession.
    synchroAtDebounceQueue.enqueue(req.updatedPlace.lieu_id, payload, req.log);
  }
};

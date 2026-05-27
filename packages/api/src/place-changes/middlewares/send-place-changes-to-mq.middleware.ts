import type { ApiPlace } from "@soliguide/common";

import type { ExpressRequest, ModelWithId } from "../../_models";
import {
  AmqpPlaceChangesEvent,
  RoutingKey,
  amqpEventsSender,
  Exchange,
  AmqpSynchroAirtablePlaceEvent,
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

    await amqpEventsSender.sendToQueue<AmqpSynchroAirtablePlaceEvent>(
      Exchange.SYNCHRO_AT,
      `${RoutingKey.SYNCHRO_AT}.place`,
      payload,
      req.log
    );
  }
};

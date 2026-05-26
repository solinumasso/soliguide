import {
  CAMPAIGN_DEFAULT_NAME,
  UserRightStatus,
  type ApiPlace,
} from "@soliguide/common";
import mongoose from "mongoose";

import type { ExpressRequest, ModelWithId } from "../../_models";
import {
  AmqpPlaceChangesEvent,
  RoutingKey,
  amqpEventsSender,
  Exchange,
  AmqpSynchroAirtablePlaceEvent,
  AmqpSynchroAirtableUserEvent,
} from "../../events";
import type { PlaceChanges } from "../interfaces/PlaceChanges.interface";
import { UserRightModel } from "../../user/models/userRight.model";
import {
  getUserByIdWithUserRights,
  getUserToUpdateStatus,
} from "../../user/services";
import { USER_ROLES_FOR_EDITION } from "../../user/constants";

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

    // Si la place est dans une campagne, on envoie aussi les events des users
    // qui ont des droits d'édition sur cette place
    if (req.updatedPlace.campaigns?.[CAMPAIGN_DEFAULT_NAME]) {
      const userObjectIds: mongoose.Types.ObjectId[] =
        await UserRightModel.find({
          place_id: req.updatedPlace.lieu_id,
          role: { $in: USER_ROLES_FOR_EDITION },
          status: UserRightStatus.VERIFIED,
        }).distinct("user");

      for (const userId of userObjectIds) {
        const user = await getUserByIdWithUserRights(userId);
        if (!user) continue;

        const toUpdate = await getUserToUpdateStatus(user._id);

        const userPayload = new AmqpSynchroAirtableUserEvent(
          user,
          req.requestInformation.frontendUrl,
          req.requestInformation.theme,
          false,
          toUpdate
        );

        await amqpEventsSender.sendToQueue<AmqpSynchroAirtableUserEvent>(
          Exchange.SYNCHRO_AT,
          `${RoutingKey.SYNCHRO_AT}.user`,
          userPayload,
          req.log
        );
      }
    }
  }
};

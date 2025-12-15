/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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

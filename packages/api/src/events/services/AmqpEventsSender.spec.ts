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
import amqp from "amqp-connection-manager";

import { Themes } from "@soliguide/common";

import { CONFIG, type InvitationPopulate } from "../../_models";
import { INVITATION } from "../../../mocks";
import { AmqpEventsSender } from "./AmqpEventsSender";
import { AmqpInvitationEvent } from "../classes";
import { Exchange, RoutingKey } from "../enums";

describe("Test AmqpEventsSender", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Works when no URL provided", async () => {
    delete CONFIG.AMQP_URL;
    const amqpMock = jest.spyOn(amqp, "connect");
    const sender = new AmqpEventsSender();
    expect(amqpMock).not.toHaveBeenCalled();
    await sender.sendToQueue<AmqpInvitationEvent>(
      Exchange.INVITATIONS,
      `${RoutingKey.INVITATIONS}.accepted`,
      new AmqpInvitationEvent(
        {
          ...INVITATION,
        } as unknown as InvitationPopulate,
        CONFIG.SOLIGUIDE_FR_URL,
        Themes.SOLIGUIDE_FR
      )
    );
    // Expect nothing, just no exceptions
  });
});

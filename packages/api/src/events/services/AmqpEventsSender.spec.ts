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

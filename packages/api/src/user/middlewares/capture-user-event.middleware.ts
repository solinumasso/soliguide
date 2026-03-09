import { ExpressRequest, UserPopulateType } from "../../_models";
import { PosthogClient } from "../../analytics/services";
import { TRACKED_EVENTS } from "../../analytics/constants";

const captureUserEvent = (
  req: ExpressRequest & { selectedUser: UserPopulateType },
  event: string
) => {
  PosthogClient.instance.capture({
    event,
    req,
    properties: {
      frontendUrl: req.requestInformation.frontendUrl,
      user_id: req.selectedUser.user_id,
      territories: req.selectedUser.territories,
    },
  });
};

export const capturePasswordReset = (
  req: ExpressRequest & { selectedUser: UserPopulateType }
) => {
  captureUserEvent(req, TRACKED_EVENTS.API_SEND_PASSWORD_RESET_EMAIL);
};

export const capturePasswordResetToken = (
  req: ExpressRequest & { selectedUser: UserPopulateType }
) => {
  captureUserEvent(req, TRACKED_EVENTS.API_RESEND_INVITATION_EMAIL);
};


import {
  ExpressRequest,
  InvitationPopulate,
  UserPopulateType,
} from "../../_models";
import { PosthogClient } from "../../analytics/services";
import { TRACKED_EVENTS } from "../../analytics/constants";

const captureInvitationEvent = (
  req: ExpressRequest & { invitation: InvitationPopulate },
  event: string,
  userWhoInvited?: UserPopulateType
) => {
  PosthogClient.instance.capture({
    event,
    req,
    properties: {
      frontendUrl: req.requestInformation.frontendUrl,
      invitation_id: req.invitation._id,
      user_id: req.invitation.user_id,
      organization_id: req.invitation.organization_id,
      role: req.invitation.roleType,
      territories: req.invitation.territories,
      createdBy_id: userWhoInvited?._id
        ? userWhoInvited._id
        : req.invitation.createdBy,
    },
  });
};

export const captureSendInvitation = (
  req: ExpressRequest & { invitation: InvitationPopulate }
) => {
  captureInvitationEvent(
    req,
    TRACKED_EVENTS.API_SEND_INVITATION_EMAIL,
    req.user
  );
};

export const captureReSendInvitation = (
  req: ExpressRequest & { invitation: InvitationPopulate }
) => {
  captureInvitationEvent(req, TRACKED_EVENTS.API_RESEND_INVITATION_EMAIL);
};

export const captureWelcomeEvent = (
  req: ExpressRequest & { invitation: InvitationPopulate }
) => {
  captureInvitationEvent(req, TRACKED_EVENTS.API_SEND_WELCOME_EMAIL);
};

import type { AnyDepartmentCode, Themes, UserRole } from "@soliguide/common";

import type {
  InvitationPopulate,
  ModelWithId,
  User,
  UserPopulateType,
} from "../../_models";
import { AmqpOrganization, AmqpUser } from ".";
import { AmqpEvent } from "../interfaces";

export class AmqpInvitationEvent implements AmqpEvent {
  public acceptedAt?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;
  public createdBy?: AmqpUser;
  public token?: string;
  public user: AmqpUser;
  public organization: AmqpOrganization;
  public role: UserRole;
  public territories: AnyDepartmentCode[];
  public frontendUrl: string;
  public theme: Themes | null;
  public isUpdateCampaignOn: boolean;

  constructor(
    invitation: InvitationPopulate,
    frontendUrl: string,
    theme: Themes | null,
    userWhoInvited?: UserPopulateType | ModelWithId<User>,
    isUpdateCampaignOn?: boolean
  ) {
    this.user = new AmqpUser(invitation.user);
    this.acceptedAt = invitation.acceptedAt;
    this.createdAt = invitation.createdAt;
    this.updatedAt = invitation.updatedAt;
    this.createdBy = userWhoInvited ? new AmqpUser(userWhoInvited) : undefined;
    this.token = invitation.token ?? undefined;
    this.organization = new AmqpOrganization(invitation.organization);
    this.role = invitation.roleType;
    this.territories = invitation.territories;
    this.frontendUrl = frontendUrl;
    this.theme = theme;
    this.isUpdateCampaignOn = !!isUpdateCampaignOn;
  }
}

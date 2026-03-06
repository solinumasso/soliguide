import {
  CommonInvitation,
  type CommonUser,
  type AnyDepartmentCode,
  type UserRole,
} from "@soliguide/common";

import type { User } from "./user.class";
import { Organisation } from "../../admin-organisation/interfaces/organisation.interface";

export class Invitation implements CommonInvitation {
  public _id: string | null;
  public createdBy?: string;
  public createdAt: Date | null;
  public acceptedAt: Date | null;
  public roleType: UserRole;
  public territories: AnyDepartmentCode[];
  public organization: Organisation;
  public organization_id: number | null;
  public organizationName: string | null;
  public pending: boolean;
  public token: string | null;
  public user: CommonUser | User | null;
  public user_id: number | null;

  constructor(invitation?: Partial<Invitation>) {
    this._id = invitation?._id ?? null;
    this.acceptedAt = invitation?.acceptedAt
      ? new Date(invitation.acceptedAt)
      : null;
    this.roleType = invitation?.roleType ?? null;
    this.createdAt = invitation?.createdAt
      ? new Date(invitation.createdAt)
      : null;
    this.organization = invitation?.organization
      ? new Organisation(invitation.organization)
      : null;
    this.organization_id = invitation?.organization_id ?? null;
    this.organizationName = invitation?.organizationName ?? null;
    this.pending = invitation?.pending ?? true;
    this.token = invitation?.token ?? null;
    this.user = invitation?.user ?? null;
    this.user_id = invitation?.user_id ?? null;
    this.createdBy = invitation?.createdBy;
  }
}

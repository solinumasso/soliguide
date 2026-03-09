import { AnyDepartmentCode } from "../../location";
import { UserRole } from "../enums";

export interface CommonInvitation {
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  acceptedAt?: Date;
  organizationName: string;
  organization_id: number;
  pending: boolean;
  roleType: UserRole;
  territories: AnyDepartmentCode[];
  token: string | null;
  user_id: number;
}

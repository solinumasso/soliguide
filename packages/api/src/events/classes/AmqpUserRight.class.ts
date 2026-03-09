import type { UserRightStatus, UserRole } from "@soliguide/common";

import type { UserRight } from "../../_models/users";

export class AmqpUserRight {
  public organization_id: number;
  public status: UserRightStatus;
  public place_id?: number;
  public role: UserRole;

  constructor(userRight: UserRight) {
    this.role = userRight.role;
    this.organization_id = userRight.organization_id;
    this.status = userRight.status;
    this.place_id = userRight.place_id ?? undefined;
  }
}

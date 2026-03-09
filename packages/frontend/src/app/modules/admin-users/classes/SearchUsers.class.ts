import { UserSearchContext, UserStatus } from "@soliguide/common";

import { User } from "../../users/classes";
import { ManageSearch } from "../../manage-common/classes";

export class SearchUsersObject extends ManageSearch {
  public mail: string | null;
  public name: string | null;
  public status?: UserStatus;
  public verified?: boolean;
  public context: UserSearchContext;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(data: any, user: User) {
    super(data, user);
    this.mail = data?.mail ?? null;
    this.name = data?.name ?? null;
    this.status = data?.status ?? null;
    this.verified = data?.verified ?? null;
    this.context = data?.context ?? UserSearchContext.MANAGE_USERS;
  }
}

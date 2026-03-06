import { ApiOrganization, ApiPlace } from "@soliguide/common";
import { Invitation, User } from "../users";

import { ModelWithId } from "../mongo";

export type OrganizationPopulate = ModelWithId<ApiOrganization> &
  Required<{
    places: ModelWithId<ApiPlace>[];
    invitations: ModelWithId<Invitation[]>;
    users: ModelWithId<User>[];
  }>;

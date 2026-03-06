import {
  CommonUserForLogs,
  PlaceChangesSection,
  PlaceChangesStatus,
  UserStatus,
} from "@soliguide/common";

import { User } from "../../users/classes";
import { ManageSearch } from "../../manage-common/classes";

export class SearchPlaceChanges extends ManageSearch {
  public isCampaign: boolean | null;
  public lieu_id: number | null;
  public section: PlaceChangesSection | null;
  public status: PlaceChangesStatus | null;
  public userData?: Partial<CommonUserForLogs>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(data: any, user: User) {
    super(data, user);
    this.isCampaign = data?.isCampaign ?? null;
    this.lieu_id = data?.lieu_id ?? null;
    this.section = data?.section ?? null;
    this.status = data?.status ?? null;

    this.userData = data?.userData ?? {
      email: null,
      orgaId: null,
      orgaName: null,
      status: UserStatus.PRO,
      territory: null,
    };
  }
}

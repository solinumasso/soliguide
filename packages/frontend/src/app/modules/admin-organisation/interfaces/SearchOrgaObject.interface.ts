
import {
  RelationsSearch,
  UserTypes,
  RELATIONS_SEARCH,
  type AnyDepartmentCode,
  ManageSearchOptions,
} from "@soliguide/common";
import { type OrgaCampaignStatus } from "../../../models";
import { User } from "../../users/classes";
import { ManageSearch } from "../../manage-common/classes";

export class SearchOrgaObject extends ManageSearch {
  public name: string | null;
  public organization_id: number | null;
  public admin?: string;
  public toCampaignUpdate?: boolean;
  public campaignStatus?: OrgaCampaignStatus;
  public lieu_id?: number;

  public relations: RelationsSearch[];
  public userTypes: UserTypes[];
  public priority?: boolean;

  constructor(
    data?:
      | Partial<SearchOrgaObject>
      | {
          options?: Partial<ManageSearchOptions>;
          territories?: AnyDepartmentCode[];
        },
    user?: User
  ) {
    super(data, user);
    const searchOrgaObject: Partial<SearchOrgaObject> | undefined = data as
      | Partial<SearchOrgaObject>
      | undefined;
    this.organization_id = searchOrgaObject?.organization_id ?? null;
    this.name = searchOrgaObject?.name ?? null;
    this.campaignStatus = searchOrgaObject?.campaignStatus ?? undefined;
    this.lieu_id = searchOrgaObject?.lieu_id ?? undefined;
    this.admin = searchOrgaObject?.admin ?? undefined;
    this.relations = searchOrgaObject?.relations ?? RELATIONS_SEARCH;
    this.userTypes = searchOrgaObject?.userTypes ?? [];
    this.toCampaignUpdate = searchOrgaObject?.toCampaignUpdate ?? undefined;
    this.priority = searchOrgaObject?.priority ?? undefined;
  }
}

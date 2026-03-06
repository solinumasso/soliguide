import type {
  ApiPlace,
  CampaignSource,
  CommonPlaceChanges,
  CommonPlaceSource,
  CommonUserForLogs,
  PlaceChangesStatus,
  Themes,
} from "@soliguide/common";
import type { ModelWithId } from "../../_models";
import { AmqpEvent } from "../interfaces";

export class AmqpPlaceChangesEvent implements AmqpEvent {
  public _id?: string;
  // Place data
  public lieu_id: number;
  public placeName: string;

  public userData: Partial<CommonUserForLogs>;

  public campaignSource: CampaignSource | null;
  public section: string;

  public noChanges: boolean;
  public status: PlaceChangesStatus | null;

  // Content of changes
  public old: any;
  public new: any;

  public isCampaign: boolean;
  public territory: string | null;

  public createdAt: Date;
  public updatedAt: Date;

  public frontendUrl: string;
  public theme: Themes | null;

  public externalSources: CommonPlaceSource[];

  constructor(
    changes: CommonPlaceChanges,
    place: ModelWithId<ApiPlace>,
    frontendUrl: string,
    theme: Themes | null
  ) {
    this._id = changes._id;
    this.lieu_id = changes?.lieu_id;
    this.placeName = place.name;

    this.userData = changes?.userData ?? {
      orgaId: null,
      role: null,
      status: null,
      territory: null,
      orgaName: null,
      userName: null,
    };

    this.campaignSource = changes?.source ?? null;
    this.section = changes.section;
    this.noChanges = changes?.noChanges ?? false;
    this.status = changes?.status ?? null;

    this.old = changes.old;
    this.new = changes.new;

    this.externalSources = place.sources ?? [];

    this.isCampaign = changes?.isCampaign ?? false;
    this.territory = changes.territory ?? null;

    this.createdAt = new Date(changes.createdAt);
    this.updatedAt = new Date(changes.updatedAt);

    this.frontendUrl = frontendUrl;
    this.theme = theme;
  }
}

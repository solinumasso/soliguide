
import {
  CAMPAIGN_DEFAULT_NAME,
  Relations,
  ApiOrganization,
  Phone,
  AnyDepartmentCode,
  OperationalAreas,
  getTerritoriesFromAreas,
} from "@soliguide/common";
import { CampaignsForOrga } from "./campaigns-for-orga.interface";
import { Invitation } from "../../users/classes/invitation.class";
import { CampaignsForPlace } from "../../../models/place/classes/campaigns-for-place.class";
import { PlaceForOrganization, UserForOrganization } from "../types";
import { campaignIsActiveWithTheme } from "../../../shared/functions/campaign";
import { THEME_CONFIGURATION } from "../../../models";

export class Organisation implements Partial<ApiOrganization> {
  public _id: string;
  public organization_id: number;
  public name: string;
  public description: string;
  public logo?: string;
  public places: PlaceForOrganization[];
  public invitations: Invitation[];
  public users: UserForOrganization[];
  public territories: AnyDepartmentCode[];
  public phone: Phone | null;
  public mail?: string;
  public website?: string;
  public facebook?: string;
  public fax: string | null;
  public createdAt: Date;
  public updatedAt: Date;
  public campaigns?: CampaignsForOrga;
  public verified: {
    date: Date;
    status: boolean;
  };
  public priority: boolean;
  public relations: Relations[];

  public isCampaignActive: boolean;
  public areas: OperationalAreas;
  public lastLogin: Date | null;

  constructor(organisation?: Partial<ApiOrganization>, populate = false) {
    this.organization_id = null;
    this.areas = organisation?.areas;
    this._id = organisation?._id ?? null;
    this.organization_id =
      typeof organisation?.organization_id === "number"
        ? organisation.organization_id
        : null;
    this.name = organisation?.name ?? "";
    this.logo = organisation?.logo ?? "";
    this.phone = organisation?.phone ?? null;
    this.fax = organisation?.fax ?? "";
    this.mail = organisation?.mail ?? "";
    this.website = organisation?.website ?? "";
    this.facebook = organisation?.facebook ?? "";
    this.description = organisation?.description ?? "";
    this.places = organisation?.places ?? [];
    this.places.forEach((place: PlaceForOrganization) => {
      if (place.campaigns) {
        place.campaigns = new CampaignsForPlace(
          place.campaigns[`${CAMPAIGN_DEFAULT_NAME}`]
        );
      }
    });
    this.invitations =
      organisation?.invitations?.filter(
        (invitation: Invitation) => invitation.pending
      ) ?? [];
    this.users = organisation?.users ?? [];

    this.territories = organisation
      ? getTerritoriesFromAreas(
          organisation as ApiOrganization,
          THEME_CONFIGURATION.country
        )
      : [];

    this.campaigns = new CampaignsForOrga(
      organisation?.campaigns?.[`${CAMPAIGN_DEFAULT_NAME}`]
    );
    this.priority = organisation?.priority ?? false;
    this.createdAt = organisation?.createdAt ?? new Date();
    this.lastLogin = organisation?.lastLogin ?? null;
    this.relations = organisation?.relations ?? [];
    if (populate) {
      this.invitations = this.invitations.filter(
        (invitation: Invitation) => invitation.pending
      );
    }

    this.isCampaignActive =
      campaignIsActiveWithTheme(this.territories) &&
      this.campaigns.runningCampaign.toUpdate;
  }
}

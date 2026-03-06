import { computeValidity } from "../functions";
import { formatInTimeZone } from "date-fns-tz";
import { InfoColor } from "../types";
import { OpeningHours } from "../../hours";
import { TempInfo } from "../interfaces";
import { TempInfoStatus } from "../enums";

export class BasePlaceTempInfo {
  public _id?: string;
  public actif: boolean;
  public dateDebut: Date | null;
  public dateFin: Date | null;
  public description: string | null;
  public infoColor: InfoColor | null;
  public isCampaign?: boolean;
  public isService?: boolean;
  public name: string | null;
  public status: TempInfoStatus | null;

  public hours: OpeningHours | null;

  // TODO to be removed when we add the multiple closures services
  public serviceActif?: boolean;

  constructor(tempInfos?: Partial<TempInfo> | null, isInForm = false) {
    this._id = tempInfos?._id ?? undefined;
    this.actif = false;
    this.dateDebut = null;
    this.dateFin = null;
    this.description = null;
    this.infoColor = null;
    this.isCampaign = false;
    this.isService = false;
    this.name = null;
    this.status = null;

    this.hours = null;

    this.serviceActif = false;

    if (tempInfos) {
      this.actif = tempInfos.actif ?? false;
      this.dateDebut = tempInfos.dateDebut
        ? new Date(
            formatInTimeZone(tempInfos.dateDebut, "Etc/GMT", "yyyy-MM-dd")
          )
        : null;
      this.dateFin = tempInfos.dateFin
        ? new Date(formatInTimeZone(tempInfos.dateFin, "Etc/GMT", "yyyy-MM-dd"))
        : null;
      this.description = tempInfos.description ?? null;
      this.isCampaign = tempInfos.isCampaign ?? false;
      this.isService = Boolean(tempInfos?.serviceObjectId?.length);
      this.name = tempInfos.name ?? null;

      if (tempInfos?.hours instanceof OpeningHours) {
        this.hours = tempInfos.hours;
      } else {
        this.hours = new OpeningHours(tempInfos.hours, isInForm);
      }

      this.serviceActif = this.isService && this.actif;
    }

    const validity = computeValidity(this.dateDebut, this.dateFin);

    this.actif = validity.active;
    this.infoColor = validity.infoColor;
    this.status = validity.status;
  }
}

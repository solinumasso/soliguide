import {
  CommonNewPlaceService,
  getCategoriesSpecificFields,
  BasePlaceTempInfo,
  OpeningHours,
} from "@soliguide/common";
import { THEME_CONFIGURATION } from "../../themes";

export class Service extends CommonNewPlaceService {
  public hasSpecialName: boolean;
  public show: boolean;
  public override close: BasePlaceTempInfo = new BasePlaceTempInfo();

  public showHoraires: boolean;
  public showPublics: boolean;
  public showModalities: boolean;
  public override hours: OpeningHours = new OpeningHours();

  constructor(
    service?: Partial<Service | CommonNewPlaceService>,
    isInForm = false
  ) {
    super(service, isInForm);

    this.hasSpecialName = this.category
      ? this.category in
        getCategoriesSpecificFields(THEME_CONFIGURATION.country)
      : false;

    if (service) {
      this.hours = new OpeningHours(service?.hours, isInForm);
      this.close = new BasePlaceTempInfo(
        {
          serviceObjectId: this.serviceObjectId,
          ...service.close,
        },
        isInForm
      );
    } else {
      this.close = new BasePlaceTempInfo(
        { serviceObjectId: "NEW_SERVICE_OBJECT_ID" },
        isInForm
      );
      this.hours = new OpeningHours(null, isInForm);
    }
    this.showHoraires = false;
    this.showPublics = false;
    this.showModalities = false;

    this.show = false;
    if (typeof (service as Service)?.show === "boolean") {
      this.show = (service as Service).show;
    }
  }
}

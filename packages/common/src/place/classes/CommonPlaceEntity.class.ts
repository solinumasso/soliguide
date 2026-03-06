
import { Phone } from "../../phone";

export class CommonPlaceEntity {
  public phones: Phone[];
  public facebook?: string;
  public fax?: string;
  public instagram?: string;
  public mail?: string;
  public name?: string;
  public website?: string;

  constructor(entity?: Partial<CommonPlaceEntity>) {
    this.facebook = entity?.facebook ?? undefined;
    this.fax = entity?.fax ?? undefined;
    this.instagram = entity?.instagram ?? undefined;
    this.mail = entity?.mail ?? undefined;
    this.name = entity?.name ?? undefined;
    this.website = entity?.website ?? undefined;
    this.phones = entity?.phones ?? [];
  }
}

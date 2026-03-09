import { environment } from "../../../../environments/environment";

export class Photo {
  public label: string;
  public createdAt: Date;
  public createdBy: string;
  public filetype: string;

  public _id: string;
  public photoUrl: string;

  public path: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(photo?: any) {
    this._id = photo?._id ?? "";
    this.label = photo?.label ?? "";
    this.path = photo?.path ?? "";
    this.createdBy = photo?.createdBy ?? "";
    this.filetype = photo?.filetype ?? "";
    this.path = photo?.path ?? "";
    this.createdAt = (photo && new Date(photo.createdAt)) ?? new Date();
    this.photoUrl = "";

    this.photoUrl = `${environment.apiUrl}/medias/pictures/${this.path}`;
  }
}

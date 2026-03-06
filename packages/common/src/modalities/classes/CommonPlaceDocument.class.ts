export class CommonPlaceDocument {
  public _id: any;
  public createdAt: Date;
  public updatedAt?: Date;
  public encoding: string;
  public filename: string;
  public mimetype: string;
  public name: string;
  public path: string;
  public size: number;
  public lieu_id?: number;
  public serviceId: number | null;

  constructor(doc?: Partial<CommonPlaceDocument>) {
    this._id = doc?._id ?? "";
    this.name = doc?.name ?? "";
    this.filename = doc?.filename ?? "";
    this.path = doc?.path ?? "";
    this.mimetype = doc?.mimetype ?? "";
    this.encoding = doc?.encoding ?? "";
    this.size = doc?.size ?? 0;
    this.createdAt = (doc?.createdAt && new Date(doc.createdAt)) ?? new Date();
    this.updatedAt = (doc?.updatedAt && new Date(doc.updatedAt)) ?? new Date();
    this.lieu_id = doc?.lieu_id;
    this.serviceId = doc?.serviceId ?? null;
  }
}

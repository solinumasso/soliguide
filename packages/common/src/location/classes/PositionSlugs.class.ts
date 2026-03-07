import { slugLocation } from "../../general";

export class PositionSlugs {
  public ville?: string; // @deprecated
  public departement?: string; // @deprecated
  public pays?: string; // @deprecated

  public department?: string;
  public country?: string;
  public region?: string;
  public city?: string;

  constructor(data: {
    city?: string;
    department?: string;
    region?: string;
    country?: string;
    ville?: string;
    departement?: string;
    pays?: string;
  }) {
    this.city = data?.city ? slugLocation(data?.city) : undefined;
    this.department = data?.department
      ? slugLocation(data?.department)
      : undefined;
    this.region = data?.region ? slugLocation(data?.region) : undefined;
    this.country = data?.country ? slugLocation(data?.country) : undefined;

    // Deprecated fields
    this.ville = this.city;
    this.departement = this?.department;
    this.pays = this?.country;
  }
}

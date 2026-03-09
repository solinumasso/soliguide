import type {
  ApiOrganization,
  AnyDepartmentCode,
  Phone,
  Relations,
} from "@soliguide/common";

import type { ModelWithId } from "../../_models";

export class AmqpOrganization {
  public createdAt?: Date;
  public updatedAt?: Date;
  public name: string;
  public organization_id: number;
  public email?: string;
  public phone?: Phone;
  public territories?: AnyDepartmentCode[];
  public priority: boolean;
  public relations: Relations[];
  public website?: string;

  constructor(
    organization: ApiOrganization | ModelWithId<Omit<ApiOrganization, "_id">>
  ) {
    this.name = organization.name;
    this.organization_id = organization.organization_id;
    this.email = organization.mail ?? undefined;
    this.phone = organization.phone ?? undefined;
    this.territories = organization.territories.length
      ? organization.territories
      : undefined;
    this.priority = organization.priority;
    this.relations = organization.relations;
    this.website = organization.website ?? undefined;
    this.createdAt = organization.createdAt;
    this.updatedAt = organization.updatedAt;
  }
}

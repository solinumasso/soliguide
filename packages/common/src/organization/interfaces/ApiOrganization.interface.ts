/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyDepartmentCode } from "../../location";
import { Phone } from "../../phone";
import { OperationalAreas } from "../../users";
import { Relations } from "../types";

export interface ApiOrganization {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  counters: {
    invitations: {
      EDITOR: number;
      OWNER: number;
      READER: number;
      TOTAL: number;
    };
    users: {
      EDITOR: number;
      OWNER: number;
      READER: number;
      TOTAL: number;
    };
  };
  description: string;
  facebook: string;
  fax: string | null;
  logo: string;
  mail: string;
  name: string;
  organization_id: number;
  phone: Phone | null;
  priority: boolean;
  relations: Relations[];
  // @deprecated: delete when data team is up to date
  territories: AnyDepartmentCode[];
  verified: {
    date: Date;
    status: boolean;
  };
  website: string | null;
  places: any[];
  roles: any[];
  users: any[];
  invitations: any[];
  campaigns?: any;
  areas: OperationalAreas;
  lastLogin: Date | null;
}

import { Place } from "../../../models/place/classes/place.class";

// Place version light pour les organisations
export type PlaceForOrganization = Pick<
  Place,
  | "_id"
  | "campaigns"
  | "createdAt"
  | "isOpenToday"
  | "lieu_id"
  | "name"
  | "position"
  | "seo_url"
  | "placeType"
  | "parcours"
  | "status"
  | "visibility"
  | "tempInfos"
  | "updatedByUserAt"
>;

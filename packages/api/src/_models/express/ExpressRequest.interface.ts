import type { Request } from "express";

import type { ApiPlace } from "@soliguide/common";

import type { User, UserForLogs, UserPopulateType } from "../users";
import type { ApiTranslatedField } from "../../translations/interfaces";
import type { OrganizationPopulate } from "../organization";
import type {
  PlaceChangesPopulate,
  PlaceChanges,
} from "../../place-changes/interfaces/PlaceChanges.interface";
import type { ModelWithId } from "../mongo";
import { RequestInformation } from "../../middleware";

export interface ExpressRequest extends Request {
  bodyValidated?: any; // Forms
  placeDeleted?: ModelWithId<ApiPlace>;
  // Exports log
  exportStartedAt?: Date;

  // File to upload
  file?: Express.Multer.File | Express.MulterS3.File | any;

  placeChanges?: PlaceChanges | PlaceChangesPopulate | null;
  isAdminOrPro?: boolean;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;

  // Place added to the request with getPlaceFromUrl
  lieu?: any; // TODO: type it

  nbResults?: number;

  organization?: OrganizationPopulate | any;
  token?: string;
  user?: UserPopulateType | any; // TODO: type it
  requestInformation: RequestInformation;
  selectedUser?: UserPopulateType;
  userForLogs: UserForLogs;
  userToSync?: User;

  // Place updated and added to the request for translation
  updatedPlace?: ModelWithId<ApiPlace>;
  updatedPlaces?: ModelWithId<ApiPlace>[];
  isPlaceDeleted?: boolean;

  // User updated and added to the request for potential sync
  updatedUser?: UserPopulateType;
  updatedUsers?: UserPopulateType[];
  isUserDeleted?: boolean;

  translatedField?: ApiTranslatedField;

  // Boolean to know if the search comes from the admin of not
  adminSearch?: boolean;

  // Flag to indicate if mobility categories should be converted back to legacy format in results
  shouldConvertMobilityCategories?: boolean;
}

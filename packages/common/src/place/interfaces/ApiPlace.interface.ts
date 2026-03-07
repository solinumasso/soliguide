
import type { PlaceType, PlaceStatus, PlaceVisibility } from "../enums";
import type {
  CommonNewPlaceService,
  CommonPlaceEntity,
  CommonPlacePosition,
  CommonPlaceSource,
} from "../classes";

import type { CommonPlaceParcours } from "./CommonPlaceParcours.interface";
import type { SoliguideCountries } from "../../location";
import { Modalities } from "../../modalities";
import { Publics } from "../../publics";
import { CommonOpeningHours } from "../../hours";
import { SupportedLanguagesCode } from "../../translations";
import { PlaceStepsDone } from "./PlaceStepsDone.interface";
import { PlaceSlugs } from "./PlaceSlugs.interface";

export interface ApiPlace {
  _id?: string;
  lieu_id: number;
  seo_url: string;

  auto: boolean;
  name: string;
  description: string | null;

  status: PlaceStatus;
  visibility: PlaceVisibility;
  isOpenToday: boolean;

  photos: any[];
  organizations: any[];
  placeType: PlaceType;
  services_all: CommonNewPlaceService[];
  position: CommonPlacePosition;
  parcours: CommonPlaceParcours[];
  entity: CommonPlaceEntity;

  newhours: CommonOpeningHours;
  modalities: Modalities;
  publics: Publics;
  sourceLanguage: SupportedLanguagesCode;
  country: SoliguideCountries;
  languages: string[];

  createdAt: Date | string;
  updatedAt: Date | string;
  updatedByUserAt: Date | string;
  createdBy: string | null;

  stepsDone: PlaceStepsDone;

  tempInfos: any;

  sources?: CommonPlaceSource[];

  campaigns?: any;

  priority?: boolean;

  slugs?: PlaceSlugs;
  distance?: number;
}

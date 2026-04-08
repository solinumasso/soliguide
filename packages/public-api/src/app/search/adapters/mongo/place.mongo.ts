import {
  type ApiPlace,
  type CommonDayOpeningHours,
  type CommonPlaceEntity,
  type CommonNewPlaceService,
  type CommonOpeningHours,
  type CommonPlaceParcours,
  type CommonPlacePosition,
  type Modalities,
  type Publics,
} from '@soliguide/common';
import { type Document } from 'mongodb';

type DeepPartial<T> =
  T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

export type MongoTempInfos = {
  closure?: {
    dateDebut?: Date | string | null;
    dateFin?: Date | string | null;
    description?: string | null;
  };
  hours?: {
    dateDebut?: Date | string | null;
    dateFin?: Date | string | null;
    description?: string | null;
    hours?: MongoOpeningHours;
  };
  message?: {
    dateDebut?: Date | string | null;
    dateFin?: Date | string | null;
    description?: string | null;
    name?: string | null;
  };
};

type MongoPlaceBase = Omit<
  Partial<ApiPlace>,
  | 'entity'
  | 'modalities'
  | 'publics'
  | 'tempInfos'
  | 'services_all'
  | 'position'
  | 'parcours'
  | 'newhours'
>;

export type MongoPlaceDocument = Document &
  MongoPlaceBase & {
    _id?: unknown;
    slugs?: {
      infos?: {
        name?: string;
      };
    };
    entity?: DeepPartial<CommonPlaceEntity>;
    modalities?: MongoModalities;
    publics?: MongoPublics;
    tempInfos?: MongoTempInfos;
    services_all?: MongoService[];
    position?: MongoPosition;
    parcours?: Array<
      DeepPartial<CommonPlaceParcours> & {
        description?: string | null;
        position?: MongoPosition;
        hours?: MongoOpeningHours;
      }
    >;
    newhours?: MongoOpeningHours;
  };

export type MongoService = DeepPartial<CommonNewPlaceService>;

export type MongoPosition = DeepPartial<CommonPlacePosition>;

export type MongoModalities = DeepPartial<Modalities>;

export type MongoPublics = DeepPartial<Publics>;

export type MongoOpeningHours = DeepPartial<CommonOpeningHours>;

export type MongoDayOpeningHours = DeepPartial<CommonDayOpeningHours>;

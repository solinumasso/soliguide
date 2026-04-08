import { Injectable } from '@nestjs/common';
import { ObjectId, type Document } from 'mongodb';
import { PlacesDatabaseService } from '../../../search/adapters/mongo/places-database.service';
import type {
  SearchV20260303LegacyPlaceSnapshotReader,
  V20260303LegacyPlaceSnapshot,
} from './2026-03-03.legacy-place-snapshot-reader.port';

type LegacyPlaceDocument = Document & {
  _id?: unknown;
  auto?: unknown;
  close?: unknown;
  createdAt?: unknown;
  distance?: unknown;
  geoZones?: unknown;
  lieu_id?: unknown;
  modalities?: unknown;
  newhours?: unknown;
  parcours?: unknown;
  photos?: unknown;
  publics?: unknown;
  services_all?: unknown;
  slugs?: unknown;
  sources?: unknown;
  status?: unknown;
  tempInfos?: unknown;
  updatedByUserAt?: unknown;
  visibility?: unknown;
};

@Injectable()
export class MongoSearchV20260303LegacyPlaceSnapshotReader implements SearchV20260303LegacyPlaceSnapshotReader {
  constructor(private readonly placesDatabaseService: PlacesDatabaseService) {}

  async readByCanonicalIds(
    ids: readonly string[],
  ): Promise<ReadonlyMap<string, V20260303LegacyPlaceSnapshot>> {
    const canonicalIds = [
      ...new Set(ids.map((id) => id.trim()).filter(Boolean)),
    ];
    if (canonicalIds.length === 0) {
      return new Map();
    }

    const numericIds = canonicalIds.filter(isIntegerString).map(Number);
    const objectIdStrings = canonicalIds.filter((id) => ObjectId.isValid(id));

    const filters: Document[] = [];
    if (numericIds.length > 0) {
      filters.push({ lieu_id: { $in: numericIds } });
    }

    if (objectIdStrings.length > 0) {
      filters.push({
        _id: { $in: objectIdStrings.map((id) => new ObjectId(id)) },
      });
      filters.push({ _id: { $in: objectIdStrings } });
    }

    if (filters.length === 0) {
      return new Map();
    }

    const documents =
      await this.placesDatabaseService.aggregatePlaces<LegacyPlaceDocument>([
        {
          $match: {
            $or: filters,
          },
        },
        {
          $project: {
            _id: 1,
            auto: 1,
            close: 1,
            createdAt: 1,
            distance: 1,
            geoZones: 1,
            lieu_id: 1,
            modalities: 1,
            newhours: 1,
            parcours: 1,
            photos: 1,
            publics: 1,
            services_all: 1,
            slugs: 1,
            sources: 1,
            status: 1,
            tempInfos: 1,
            updatedByUserAt: 1,
            visibility: 1,
          },
        },
      ]);

    const snapshotsById = new Map<string, V20260303LegacyPlaceSnapshot>();

    for (const document of documents) {
      const canonicalId = this.readCanonicalId(document);
      if (!canonicalId || snapshotsById.has(canonicalId)) {
        continue;
      }

      snapshotsById.set(canonicalId, this.toSnapshot(document));
    }

    return snapshotsById;
  }

  private readCanonicalId(document: LegacyPlaceDocument): string | undefined {
    if (
      typeof document.lieu_id === 'string' ||
      typeof document.lieu_id === 'number'
    ) {
      return String(document.lieu_id);
    }

    return this.normalizeMongoObjectId(document._id);
  }

  private toSnapshot(
    document: LegacyPlaceDocument,
  ): V20260303LegacyPlaceSnapshot {
    return {
      _id: this.normalizeMongoObjectId(document._id),
      auto: document.auto,
      status: document.status,
      visibility: document.visibility,
      close: document.close,
      sources: document.sources,
      updatedByUserAt: document.updatedByUserAt,
      slugs: document.slugs,
      distance: document.distance,
      photos: document.photos,
      geoZones: document.geoZones,
      createdAt: document.createdAt,
      modalities: document.modalities,
      publics: document.publics,
      newhours: document.newhours,
      tempInfos: document.tempInfos,
      services_all: document.services_all,
      parcours: document.parcours,
    };
  }

  private normalizeMongoObjectId(value: unknown): string | undefined {
    if (value instanceof ObjectId) {
      return value.toHexString();
    }

    if (typeof value === 'string') {
      return value;
    }

    if (
      typeof value === 'number' ||
      typeof value === 'bigint' ||
      typeof value === 'boolean'
    ) {
      return String(value);
    }

    return undefined;
  }
}

function isIntegerString(value: string): boolean {
  if (!/^-?\d+$/.test(value)) {
    return false;
  }

  const asNumber = Number(value);
  return Number.isSafeInteger(asNumber) && String(asNumber) === value;
}

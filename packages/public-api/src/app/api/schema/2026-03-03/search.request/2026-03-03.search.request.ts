import {
  GeoTypes,
  PublicsAdministrative,
  PublicsFamily,
  PublicsGender,
  PublicsOther,
  UpdatedAtInterval,
  WelcomedPublics,
} from '@soliguide/common';
import {
  CustomTransformChange,
  RenameFieldChange,
  ReplaceFieldChange,
} from '../../../../../api-versioning/versioning';
import z from 'zod';
import type { V20260101SearchRequest } from '../../2026-01-01/search.request/2026-01-01.search.request.generated';
import { MaybeAsync } from '../../../../../api-versioning';

function normalizeString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function toIsoDate(value: unknown): string | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  const normalized = normalizeString(value);
  if (!normalized) {
    return undefined;
  }

  const asDate = new Date(normalized);
  if (Number.isNaN(asDate.getTime())) {
    return undefined;
  }

  return asDate.toISOString().slice(0, 10);
}

function buildCanonicalLocation(
  location: V20260101SearchRequest['location'],
): Record<string, unknown> | undefined {
  if (!location || typeof location !== 'object') {
    return undefined;
  }

  const legacyLocation = location;
  const canonicalLocation: Record<string, unknown> = {};
  const geoType = legacyLocation.geoType;
  const geoValue = normalizeString(legacyLocation.geoValue);

  const country =
    normalizeString(legacyLocation.country) ??
    (geoType === GeoTypes.COUNTRY ? geoValue : undefined);
  if (country) {
    canonicalLocation.country = country;
  }

  const administrativeDivision: Record<string, unknown> = {};
  const regionCode = normalizeString(legacyLocation.regionCode);
  const region =
    normalizeString(legacyLocation.region) ??
    (geoType === GeoTypes.REGION ? geoValue : undefined);
  const departmentCode = normalizeString(legacyLocation.departmentCode);
  const department =
    normalizeString(legacyLocation.department) ??
    (geoType === GeoTypes.DEPARTMENT ? geoValue : undefined);

  if (regionCode) {
    administrativeDivision.regionCode = regionCode;
  }
  if (region) {
    administrativeDivision.region = region;
  }
  if (departmentCode) {
    administrativeDivision.departmentCode = departmentCode;
  }
  if (department) {
    administrativeDivision.department = department;
  }

  if (Object.keys(administrativeDivision).length > 0) {
    canonicalLocation.administrativeDivision = administrativeDivision;
  }

  const cityFromLabel = normalizeString(legacyLocation.label);
  const cityFromGeoValue =
    geoType === GeoTypes.CITY || geoType === GeoTypes.BOROUGH
      ? geoValue
      : undefined;
  const cityValue = cityFromGeoValue ?? cityFromLabel;

  if (cityValue) {
    canonicalLocation.city = {
      type: geoType === GeoTypes.BOROUGH ? 'postalCode' : 'city',
      value: cityValue,
    };
  }

  const legacyCoordinates = legacyLocation.coordinates;
  if (
    Array.isArray(legacyCoordinates) &&
    legacyCoordinates.length === 2 &&
    typeof legacyCoordinates[0] === 'number' &&
    typeof legacyCoordinates[1] === 'number'
  ) {
    canonicalLocation.coordinates = {
      latitude: legacyCoordinates[1],
      longitude: legacyCoordinates[0],
    };
  }

  if (typeof legacyLocation.distance === 'number') {
    canonicalLocation.radiusKm = legacyLocation.distance;
  }

  return Object.keys(canonicalLocation).length > 0
    ? canonicalLocation
    : undefined;
}

function buildCanonicalAccess(
  modalities: V20260101SearchRequest['modalities'],
): Record<string, unknown> | undefined {
  if (!modalities || typeof modalities !== 'object') {
    return undefined;
  }

  const legacyModalities = modalities;
  const access: Record<string, unknown> = {};

  if (typeof legacyModalities.inconditionnel === 'boolean') {
    access.kind = legacyModalities.inconditionnel
      ? 'unconditional'
      : 'conditional';
  }

  const modes: string[] = [];
  if (legacyModalities.appointment) {
    modes.push('appointment');
  }
  if (legacyModalities.inscription) {
    modes.push('registration');
  }
  if (legacyModalities.orientation) {
    modes.push('orientation');
  }

  if (modes.length > 0) {
    access.modes = modes;
  }

  return Object.keys(access).length > 0 ? access : undefined;
}

function buildCanonicalAudience(
  publics: V20260101SearchRequest['publics'],
): Record<string, unknown> | undefined {
  if (!publics || typeof publics !== 'object') {
    return undefined;
  }

  const legacyPublics = publics;
  const audience: Record<string, unknown> = {};

  if (legacyPublics.accueil === WelcomedPublics.UNCONDITIONAL) {
    audience.admissionPolicy = 'open';
    audience.isTargeted = false;
  }

  if (
    legacyPublics.accueil === WelcomedPublics.PREFERENTIAL ||
    legacyPublics.accueil === WelcomedPublics.EXCLUSIVE
  ) {
    audience.admissionPolicy = 'restricted';
    audience.isTargeted = legacyPublics.accueil === WelcomedPublics.EXCLUSIVE;
  }

  if (typeof legacyPublics.age === 'number') {
    audience.age = {
      min: legacyPublics.age,
      max: legacyPublics.age,
    };
  }

  const administrativeStatuses = legacyPublics.administrative?.filter(
    (status) => status !== PublicsAdministrative.all,
  );
  if (administrativeStatuses?.length) {
    audience.administrativeStatuses = administrativeStatuses;
  }

  const familySituations = legacyPublics.familialle?.filter(
    (situation) => situation !== PublicsFamily.all,
  );
  if (familySituations?.length) {
    audience.familySituations = familySituations;
  }

  const genders = legacyPublics.gender?.filter(
    (gender) => gender !== PublicsGender.all,
  );
  if (genders?.length) {
    audience.genders = genders;
  }

  const otherCharacteristics = legacyPublics.other?.filter(
    (characteristic) => characteristic !== PublicsOther.all,
  );
  if (otherCharacteristics?.length) {
    audience.otherCharacteristics = otherCharacteristics;
  }

  return Object.keys(audience).length > 0 ? audience : undefined;
}

function buildCanonicalUpdatedAt(
  updatedAt: V20260101SearchRequest['updatedAt'],
): Record<string, unknown> | undefined {
  if (!updatedAt || typeof updatedAt !== 'object') {
    return undefined;
  }

  const legacyUpdatedAt = updatedAt;
  const dateValue = toIsoDate(legacyUpdatedAt.value);
  if (!dateValue) {
    return undefined;
  }

  if (legacyUpdatedAt.intervalType === UpdatedAtInterval.SPECIFIC_DAY) {
    return { on: dateValue };
  }

  if (legacyUpdatedAt.intervalType === UpdatedAtInterval.BEFORE_DAY) {
    return { before: dateValue };
  }

  if (legacyUpdatedAt.intervalType === UpdatedAtInterval.AFTER_DAY) {
    return { after: dateValue };
  }

  return { on: dateValue };
}

function buildCanonicalPagination(
  options: V20260101SearchRequest['options'],
): Record<string, unknown> | undefined {
  if (!options || typeof options !== 'object') {
    return undefined;
  }

  const legacyOptions = options;
  const pagination: Record<string, unknown> = {};

  if (typeof legacyOptions.page === 'number') {
    pagination.page = legacyOptions.page;
  }

  if (typeof legacyOptions.limit === 'number') {
    pagination.limit = legacyOptions.limit;
  }

  return Object.keys(pagination).length > 0 ? pagination : undefined;
}

export class RenameLegacyWordToQuery extends RenameFieldChange {
  override description =
    'Rename legacy free-text request field "word" to canonical "q".';
  override payloadPath = '/' as const;
  override from = 'word';
  override to = 'q';
  override schema = z.string().nullable().optional();

  override upgrade(
    _: unknown,
    container: { word?: unknown },
  ): MaybeAsync<unknown> {
    return normalizeString(container.word);
  }
}

export class RenameLegacyLanguagesToLanguage extends RenameFieldChange {
  override description =
    'Rename legacy "languages" field to canonical single language preference "language".';
  override payloadPath = '/' as const;
  override from = 'languages';
  override to = 'language';
  override schema = z.string().nullable().optional();

  override upgrade(
    _: unknown,
    container: { languages?: unknown },
  ): MaybeAsync<unknown> {
    return normalizeString(container.languages);
  }
}

export class NormalizeLegacyCategoriesChange extends CustomTransformChange {
  override description =
    'Normalize legacy category filters ("category" + "categories") into canonical "categories".';
  override payloadPath = '/' as const;

  override schemaPatchSet() {
    return {
      categories: z.array(z.string()).optional(),
    };
  }

  override schemaPatchRemove() {
    return ['category'];
  }

  override upgrade(
    container: Record<string, unknown>,
  ): MaybeAsync<Record<string, unknown>> {
    const normalizedCategories: string[] = [];
    const seen = new Set<string>();

    const category = normalizeString(container.category);
    if (category && !seen.has(category)) {
      normalizedCategories.push(category);
      seen.add(category);
    }

    const categories = container.categories;
    if (Array.isArray(categories)) {
      for (const categoryEntry of categories) {
        const normalized = normalizeString(categoryEntry);
        if (!normalized || seen.has(normalized)) {
          continue;
        }

        normalizedCategories.push(normalized);
        seen.add(normalized);
      }
    }

    return {
      ...container,
      categories:
        normalizedCategories.length > 0 ? normalizedCategories : undefined,
    };
  }
}

export class NormalizeLegacyLocationChange extends ReplaceFieldChange {
  override description =
    'Migrate legacy location filter shape to canonical location DTO.';
  override payloadPath = '/' as const;
  override field = 'location';
  override schema = z
    .object({
      country: z.string().optional(),
      administrativeDivision: z
        .object({
          regionCode: z.string().optional(),
          region: z.string().optional(),
          departmentCode: z.string().optional(),
          department: z.string().optional(),
        })
        .optional(),
      city: z
        .object({
          type: z.enum(['city', 'postalCode']).optional(),
          value: z.string().optional(),
        })
        .optional(),
      coordinates: z
        .object({
          latitude: z.number().optional(),
          longitude: z.number().optional(),
        })
        .optional(),
      radiusKm: z.number().optional(),
    })
    .optional();

  override upgrade(value: unknown): MaybeAsync<unknown> {
    return buildCanonicalLocation(value as V20260101SearchRequest['location']);
  }
}

export class RenameLegacyOpenTodayToAvailability extends RenameFieldChange {
  override description =
    'Nest legacy "openToday" flag under canonical availability filter.';
  override payloadPath = '/' as const;
  override from = 'openToday';
  override to = 'availability';
  override schema = z
    .object({
      openToday: z.boolean().optional(),
    })
    .optional();

  override upgrade(
    _: unknown,
    container: { openToday?: unknown },
  ): MaybeAsync<unknown> {
    if (typeof container.openToday !== 'boolean') {
      return undefined;
    }

    return { openToday: container.openToday };
  }
}

export class RenameLegacyModalitiesToAccess extends RenameFieldChange {
  override description =
    'Migrate legacy modalities filter to canonical access filter.';
  override payloadPath = '/' as const;
  override from = 'modalities';
  override to = 'access';
  override schema = z
    .object({
      kind: z.enum(['unconditional', 'conditional']).optional(),
      modes: z
        .array(z.enum(['appointment', 'registration', 'orientation']))
        .optional(),
    })
    .optional();

  override upgrade(value: unknown): MaybeAsync<unknown> {
    return buildCanonicalAccess(value as V20260101SearchRequest['modalities']);
  }
}

export class RenameLegacyPublicsToAudience extends RenameFieldChange {
  override description =
    'Migrate legacy publics filter to canonical audience filter.';
  override payloadPath = '/' as const;
  override from = 'publics';
  override to = 'audience';
  override schema = z
    .object({
      admissionPolicy: z.enum(['open', 'restricted']).optional(),
      isTargeted: z.boolean().optional(),
      administrativeStatuses: z.array(z.string()).optional(),
      age: z
        .object({
          min: z.number().optional(),
          max: z.number().optional(),
        })
        .optional(),
      familySituations: z.array(z.string()).optional(),
      genders: z.array(z.string()).optional(),
      otherCharacteristics: z.array(z.string()).optional(),
    })
    .optional();

  override upgrade(value: unknown): MaybeAsync<unknown> {
    return buildCanonicalAudience(value as V20260101SearchRequest['publics']);
  }
}

export class ReplaceLegacyUpdatedAtChange extends ReplaceFieldChange {
  override description =
    'Migrate legacy updatedAt interval/value format to canonical on/before/after format.';
  override payloadPath = '/' as const;
  override field = 'updatedAt';
  override schema = z
    .object({
      on: z.string().optional(),
      before: z.string().optional(),
      after: z.string().optional(),
    })
    .optional();

  override upgrade(value: unknown): MaybeAsync<unknown> {
    return buildCanonicalUpdatedAt(
      value as V20260101SearchRequest['updatedAt'],
    );
  }
}

export class RenameLegacyOptionsToPagination extends RenameFieldChange {
  override description =
    'Migrate legacy options pagination fields to canonical pagination object.';
  override payloadPath = '/' as const;
  override from = 'options';
  override to = 'pagination';
  override schema = z
    .object({
      page: z.number().optional(),
      limit: z.number().optional(),
    })
    .optional();

  override upgrade(value: unknown): MaybeAsync<unknown> {
    return buildCanonicalPagination(value as V20260101SearchRequest['options']);
  }
}

export class DropLegacySearchRequestFieldsChange extends CustomTransformChange {
  override description =
    'Drop legacy request fields that are not part of the canonical search DTO.';
  override payloadPath = '/' as const;

  override schemaPatchRemove() {
    return ['locations', 'placeType', 'widgetId'];
  }

  override upgrade(
    container: Record<string, unknown>,
  ): MaybeAsync<Record<string, unknown>> {
    const { locations, placeType, widgetId, ...rest } = container;
    void locations;
    void placeType;
    void widgetId;
    return rest;
  }
}

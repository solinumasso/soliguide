import z from 'zod';
import {
  PlaceClosedHolidays,
  PlaceType,
  ServiceSaturation,
} from '@soliguide/common';
import {
  CustomTransformChange,
  RemoveFieldChange,
  ReplaceFieldChange,
  RenameFieldChange,
  type ResponseDowngradeContext,
} from '../../../../../api-versioning/versioning';
import { contactSchema, type Contact } from './contact';
import { serviceSchema, type Service } from './service';
import { accessSchema, type Access } from './access';
import { audienceSchema, type Audience } from './audience';
import { type Location, locationSchema } from './location';
import { type Schedule, scheduleSchema } from './schedule';
import {
  temporaryInformationSchema,
  type TemporaryInformation,
} from './temporary-information';
import { type V20260101SearchResponse } from '../../2026-01-01/search.response/2026-01-01.search.response.generated';

type V20260101SearchPlaceResponse = NonNullable<
  V20260101SearchResponse['places']
>[number];
type LegacyModalities = NonNullable<V20260101SearchPlaceResponse['modalities']>;
type LegacyService = NonNullable<
  V20260101SearchPlaceResponse['services_all']
>[number];
type LegacyTempInfos = NonNullable<V20260101SearchPlaceResponse['tempInfos']>;

type LegacyPublics = NonNullable<V20260101SearchPlaceResponse['publics']>;
type LegacyOpeningHours = NonNullable<V20260101SearchPlaceResponse['newhours']>;
type LegacyPosition = NonNullable<V20260101SearchPlaceResponse['position']>;
type LegacyParcours = NonNullable<V20260101SearchPlaceResponse['parcours']>;
type LegacyPlaceSnapshot = Partial<V20260101SearchPlaceResponse>;

interface V20260303LegacyLookupContext {
  v20260303?: {
    legacyById?: ReadonlyMap<string, LegacyPlaceSnapshot>;
  };
}

const audienceOtherStatusesToLegacyMap: Record<
  Audience['otherStatuses'],
  string
> = {
  violence: 'violence',
  addiction: 'addiction',
  disability: 'disability',
  'lgbt+': 'lgbtqPlus',
  hiv: 'hiv',
  prostitution: 'sexWork',
  prison: 'prison',
  student: 'student',
};

function readLegacySnapshot(
  container: Record<string, unknown>,
  context?: ResponseDowngradeContext,
): LegacyPlaceSnapshot | undefined {
  const id = container.id;
  if (typeof id !== 'string' && typeof id !== 'number') {
    return undefined;
  }

  const legacyById = (context as V20260303LegacyLookupContext | undefined)
    ?.v20260303?.legacyById;
  return legacyById?.get(String(id));
}

function readLegacyServiceSnapshot(
  legacyPlace: LegacyPlaceSnapshot | undefined,
  serviceId: string,
): LegacyService | undefined {
  if (!legacyPlace?.services_all || !Array.isArray(legacyPlace.services_all)) {
    return undefined;
  }

  return legacyPlace.services_all.find(
    (service) => String(service.serviceObjectId) === serviceId,
  );
}

function toLegacyModalities(
  access: Access | undefined,
  legacyModalities: LegacyModalities | undefined,
): LegacyModalities {
  if (!access) {
    return legacyModalities ?? {};
  }

  return {
    inconditionnel: access.isUnconditional,
    appointment: {
      checked: access.appointmentRequirement.isRequired,
      precisions: access.appointmentRequirement.details,
    },
    inscription: {
      checked: access.registrationRequirement.isRequired,
      precisions: access.registrationRequirement.details,
    },
    orientation: {
      checked: access.orientationRequirement.isRequired,
      precisions: access.orientationRequirement.details,
    },
    price: {
      checked: access.pricing.isPaid,
      precisions: access.pricing.details,
    },
    animal: {
      checked: access.allowPets,
    },
    pmr: {
      checked: access.isWheelchairAccessible,
    },
    docs: legacyModalities?.docs ?? [],
    other: access.otherDetails,
  };
}

function toLegacyPublics(
  audience: Audience | undefined,
  legacyPublics: LegacyPublics | undefined,
): LegacyPublics {
  if (!audience) {
    return legacyPublics ?? {};
  }

  const legacyOtherStatus =
    audienceOtherStatusesToLegacyMap[audience.otherStatuses];
  const supportContextDescription =
    audience.specialSupportContexts.length > 0
      ? `Special support contexts: ${audience.specialSupportContexts
          .map((context) => `${context.label}: ${context.details}`)
          .join(' | ')}`
      : '';
  const description = [audience.description, supportContextDescription]
    .filter((value) => value.trim().length > 0)
    .join('\n\n');

  return {
    accueil:
      audience.admissionPolicy === 'open'
        ? 0
        : (legacyPublics?.accueil ??
          (audience.isTargeted || audience.specialSupportContexts.length > 0
            ? 2
            : 1)),
    administrative: [audience.administrativeStatuses],
    familialle: [audience.familyStatuses],
    other: legacyOtherStatus ? [legacyOtherStatus] : [],
    gender: [audience.genders],
    age: audience.ageRange
      ? {
          min: audience.ageRange.min,
          max: audience.ageRange.max,
        }
      : undefined,
    description,
  };
}

function toLegacyOpeningHours(
  schedule: Schedule,
  legacyOpeningHours: LegacyOpeningHours | undefined,
): LegacyOpeningHours {
  const openingHours: LegacyOpeningHours = {
    closedHolidays: toLegacyClosedHolidays(
      schedule.publicHolidays,
      legacyOpeningHours?.closedHolidays,
    ),
  };
  const openingHoursByDay = openingHours as Record<string, unknown>;

  for (const day of schedule.weeklySchedule) {
    openingHoursByDay[day.dayOfWeek] = {
      open: day.status === 'open',
      timeslot: day.timeSlots.map((slot) => ({
        start: toLegacyTimeNumber(slot.startTime),
        end: toLegacyTimeNumber(slot.endTime),
      })),
    };
  }

  if (schedule.publicHolidays.status === 'specific') {
    const legacyHolidayDescription = schedule.publicHolidays.openedHolidays
      .map((holiday) => {
        const timeSlots = holiday.timeSlots
          .map((slot) => `${slot.startTime}-${slot.endTime}`)
          .join(', ');
        return `${holiday.label}: ${holiday.status}${
          timeSlots.length > 0 ? ` (${timeSlots})` : ''
        }`;
      })
      .join(' | ');

    if (legacyHolidayDescription.length > 0) {
      openingHours.description = legacyHolidayDescription;
    } else if (typeof legacyOpeningHours?.description === 'string') {
      openingHours.description = legacyOpeningHours.description;
    }
  }

  return openingHours;
}

function toLegacyClosedHolidays(
  publicHolidays: Schedule['publicHolidays'],
  legacyClosedHolidays: PlaceClosedHolidays | undefined,
): PlaceClosedHolidays {
  if (publicHolidays.status === 'open') {
    return PlaceClosedHolidays.OPEN;
  }

  if (publicHolidays.status === 'closed') {
    return PlaceClosedHolidays.CLOSED;
  }

  if (publicHolidays.status === 'specific') {
    if (publicHolidays.openedHolidays.length === 0) {
      return PlaceClosedHolidays.UNKNOWN;
    }

    if (
      publicHolidays.openedHolidays.every(
        (holiday) => holiday.status === 'open',
      )
    ) {
      return PlaceClosedHolidays.OPEN;
    }

    if (
      publicHolidays.openedHolidays.every(
        (holiday) => holiday.status === 'closed',
      )
    ) {
      return PlaceClosedHolidays.CLOSED;
    }
  }

  return legacyClosedHolidays ?? PlaceClosedHolidays.UNKNOWN;
}

function toLegacyTimeNumber(value: string): number {
  const [hoursRaw, minutesRaw] = value.split(':');
  const hours = Number.parseInt(hoursRaw ?? '0', 10);
  const minutes = Number.parseInt(minutesRaw ?? '0', 10);
  return hours * 100 + minutes;
}

function toLegacyDateValue(
  value: unknown,
  fallback: Date | string,
): Date | string {
  if (value instanceof Date || typeof value === 'string') {
    return value;
  }

  return fallback;
}

export class RenameUniqueIdentifier extends RenameFieldChange {
  override description =
    'Rename place field "lieu_id" to "id" in search response results to align with the canonical identifier naming in the current API and remove legacy field naming.';
  override payloadPath = '/results/*' as const;
  override from = 'lieu_id';
  override to = 'id';
  override schema = z.number().int().describe('Numeric place identifier.');
}

export class RemoveMongoObjectId extends RemoveFieldChange {
  override description =
    'Remove deprecated MongoDB identifier "_id" from search response results so the public contract exposes only business identifiers and does not leak persistence-layer implementation details.';
  override payloadPath = '/results/*' as const;
  override field = '_id';

  override downgrade(
    container: Record<string, unknown>,
    context?: ResponseDowngradeContext,
  ) {
    return readLegacySnapshot(container, context)?._id;
  }
}

export class RemoveLegacyAutoFlag extends RemoveFieldChange {
  override description =
    'Remove legacy "auto" flag from search response results because this internal automation marker is not part of the public API contract.';
  override payloadPath = '/results/*' as const;
  override field = 'auto';

  override downgrade(
    container: Record<string, unknown>,
    context?: ResponseDowngradeContext,
  ) {
    return readLegacySnapshot(container, context)?.auto;
  }
}

export class RemoveLegacyStatusField extends RemoveFieldChange {
  override description =
    'Remove legacy "status" field from search response results to avoid exposing back-office lifecycle state that is not part of the current public model.';
  override payloadPath = '/results/*' as const;
  override field = 'status';

  override downgrade(
    container: Record<string, unknown>,
    context?: ResponseDowngradeContext,
  ) {
    return readLegacySnapshot(container, context)?.status;
  }
}

export class RemoveLegacyVisibilityField extends RemoveFieldChange {
  override description =
    'Remove legacy "visibility" field from search response results to keep visibility management concerns out of the public response contract.';
  override payloadPath = '/results/*' as const;
  override field = 'visibility';

  override downgrade(
    container: Record<string, unknown>,
    context?: ResponseDowngradeContext,
  ) {
    return readLegacySnapshot(container, context)?.visibility;
  }
}

export class RemoveLegacyCloseField extends RemoveFieldChange {
  override description =
    'Remove legacy "close" field from search response results because open-state information is now represented through normalized schedule and temporary-information models.';
  override payloadPath = '/results/*' as const;
  override field = 'close';

  override downgrade(
    container: Record<string, unknown>,
    context?: ResponseDowngradeContext,
  ) {
    return readLegacySnapshot(container, context)?.close;
  }
}

export class RemoveLegacySourcesField extends RemoveFieldChange {
  override description =
    'Remove legacy "sources" field from search response results to prevent leaking internal provenance metadata that is not exposed in the current API.';
  override payloadPath = '/results/*' as const;
  override field = 'sources';

  override downgrade(
    container: Record<string, unknown>,
    context?: ResponseDowngradeContext,
  ) {
    return readLegacySnapshot(container, context)?.sources;
  }
}

export class RemoveLegacyUpdatedByUserAtField extends RemoveFieldChange {
  override description =
    'Remove legacy "updatedByUserAt" field from search response results because the public API exposes only a single canonical update timestamp.';
  override payloadPath = '/results/*' as const;
  override field = 'updatedByUserAt';

  override downgrade(
    container: Record<string, unknown>,
    context?: ResponseDowngradeContext,
  ) {
    return readLegacySnapshot(container, context)?.updatedByUserAt;
  }
}

export class RemoveLegacySlugsField extends RemoveFieldChange {
  override description =
    'Remove legacy "slugs" object from search response results after introducing the normalized "slug" field, avoiding duplicate SEO identifiers.';
  override payloadPath = '/results/*' as const;
  override field = 'slugs';

  override downgrade(
    container: Record<string, unknown>,
    context?: ResponseDowngradeContext,
  ) {
    return readLegacySnapshot(container, context)?.slugs;
  }
}

export class RemoveLegacyDistanceField extends RemoveFieldChange {
  override description =
    'Remove legacy "distance" field from search response results because distance presentation is query-context dependent and not part of the canonical place resource schema.';
  override payloadPath = '/results/*' as const;
  override field = 'distance';

  override downgrade(
    container: Record<string, unknown>,
    context?: ResponseDowngradeContext,
  ) {
    return readLegacySnapshot(container, context)?.distance;
  }
}

export class RemoveLegacyPhotosField extends RemoveFieldChange {
  override description =
    'Remove legacy "photos" field from search response results to keep the minimal search payload focused on normalized resource information.';
  override payloadPath = '/results/*' as const;
  override field = 'photos';

  override downgrade(
    container: Record<string, unknown>,
    context?: ResponseDowngradeContext,
  ) {
    return readLegacySnapshot(container, context)?.photos;
  }
}

export class RemoveLegacyGeoZonesField extends RemoveFieldChange {
  override description =
    'Remove legacy "geoZones" field from search response results because geographic targeting details are not part of the public search response contract.';
  override payloadPath = '/results/*' as const;
  override field = 'geoZones';

  override downgrade(
    container: Record<string, unknown>,
    context?: ResponseDowngradeContext,
  ) {
    return readLegacySnapshot(container, context)?.geoZones;
  }
}

export class RemoveLegacyCreatedAtField extends RemoveFieldChange {
  override description =
    'Remove legacy "createdAt" field from search response results to keep temporal metadata aligned with the single public "updatedAt" reference date.';
  override payloadPath = '/results/*' as const;
  override field = 'createdAt';

  override downgrade(
    container: Record<string, unknown>,
    context?: ResponseDowngradeContext,
  ) {
    return readLegacySnapshot(container, context)?.createdAt;
  }
}

export class RenameSeoUrl extends RenameFieldChange {
  override description =
    'Rename place field "seo_url" to "slug" in search response results to standardize SEO identifier naming with the current schema and improve API readability.';
  override payloadPath = '/results/*' as const;
  override from = 'seo_url';
  override to = 'slug';
  override schema = z
    .string()
    .describe('SEO-friendly unique slug for the place.');
}

export class IsoFormatOnUpdatedAt extends ReplaceFieldChange {
  override description =
    'Replace "updatedAt" by an ISO 8601 datetime string to provide a stable and locale-independent timestamp format that matches the current response contract.';
  override payloadPath = '/results/*' as const;
  override field = 'updatedAt';
  override schema = z.iso
    .datetime()
    .describe('Last update date and time of this place in ISO 8601 format.')
    .meta({ example: '2026-03-26T10:15:00Z' });

  override upgrade(value: unknown) {
    if (value instanceof Date) {
      return value.toISOString();
    }

    return value;
  }

  override downgrade(value: unknown) {
    if (value instanceof Date) {
      return value;
    }

    if (typeof value === 'string') {
      const date = new Date(value);

      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    }

    return value;
  }
}

export class ReplaceEntityByContacts extends CustomTransformChange {
  override description =
    'Replace legacy "entity" with "contact" in search response results and convert the legacy contact object into a normalized contact list so clients receive consistent, typed contact entries aligned with the current schema.';
  override payloadPath = '/results/*' as const;

  protected override schemaPatchSet() {
    return {
      contacts: z.array(contactSchema),
    };
  }

  protected override schemaPatchRemove() {
    return ['entity'];
  }

  override downgrade(container: Record<string, unknown>) {
    const entity: Record<string, unknown> = {};
    const contacts: Contact[] = (container.contacts as Contact[]) ?? [];

    const phones: Array<{ label: string | null; phoneNumber: string }> = [];

    for (const contact of contacts) {
      if (contact.type === 'email') {
        entity.mail = contact.value;
        continue;
      }

      if (contact.type === 'phone') {
        phones.push({
          label: contact.label,
          phoneNumber: contact.value,
        });
        continue;
      }

      if (contact.type === 'fax') {
        entity.fax = contact.value;
        continue;
      }

      if (contact.type === 'website') {
        entity.website = contact.value;
        continue;
      }

      if (contact.type === 'social') {
        if (contact.platform === 'facebook') {
          entity.facebook = contact.value;
        }

        if (contact.platform === 'instagram') {
          entity.instagram = contact.value;
        }
      }
    }

    if (phones.length > 0) {
      entity.phones = phones;
    }

    container.entity = entity;
    delete container.contacts;
  }
}

export class ReplaceServicesAllByServices extends CustomTransformChange {
  override description =
    'Replace legacy "services_all" with "services" in search response results to expose normalized service resources aligned with the current schema while preserving backward compatibility for older API versions.';
  override payloadPath = '/results/*' as const;

  protected override schemaPatchSet() {
    return {
      services: z.array(serviceSchema),
    };
  }

  protected override schemaPatchRemove() {
    return ['services_all'];
  }

  override downgrade(
    container: Record<string, unknown>,
    context?: ResponseDowngradeContext,
  ) {
    const services: Service[] = (container.services as Service[]) ?? [];
    const legacyPlace = readLegacySnapshot(container, context);
    const fallbackCreatedAt = toLegacyDateValue(
      container.updatedAt,
      new Date(0),
    );

    container.services_all = services.map((service) => ({
      ...(readLegacyServiceSnapshot(legacyPlace, service.id) ?? {}),
      category: service.category,
      description: service.description,
      differentHours: service.schedule !== null,
      differentModalities: service.access !== null,
      differentPublics: service.audience !== null,
      isOpenToday: service.isOpenToday,
      saturated: {
        precision: service.saturation.details,
        status:
          service.saturation.level === 'high'
            ? ServiceSaturation.HIGH
            : ServiceSaturation.LOW,
      },
      createdAt: toLegacyDateValue(
        (service as Record<string, unknown>).createdAt,
        readLegacyServiceSnapshot(legacyPlace, service.id)?.createdAt ??
          fallbackCreatedAt,
      ),
      serviceObjectId: service.id,
      modalities: service.access
        ? toLegacyModalities(
            service.access,
            readLegacyServiceSnapshot(legacyPlace, service.id)?.modalities,
          )
        : readLegacyServiceSnapshot(legacyPlace, service.id)?.modalities,
      publics: service.audience
        ? toLegacyPublics(
            service.audience,
            readLegacyServiceSnapshot(legacyPlace, service.id)?.publics,
          )
        : readLegacyServiceSnapshot(legacyPlace, service.id)?.publics,
      hours: service.schedule
        ? toLegacyOpeningHours(
            service.schedule,
            readLegacyServiceSnapshot(legacyPlace, service.id)?.hours,
          )
        : readLegacyServiceSnapshot(legacyPlace, service.id)?.hours,
    })) as LegacyService[];

    delete container.services;
  }
}

export class ReplaceTempInfosByTemporaryInformation extends CustomTransformChange {
  override description =
    'Replace legacy "tempInfos" with "temporaryInformation" in search response results to expose a normalized temporary-information model with explicit collections for closures, schedule adjustments, and messages.';
  override payloadPath = '/results/*' as const;

  protected override schemaPatchSet() {
    return {
      temporaryInformation: temporaryInformationSchema,
    };
  }

  protected override schemaPatchRemove() {
    return ['tempInfos'];
  }

  override downgrade(
    container: Record<string, unknown>,
    context?: ResponseDowngradeContext,
  ) {
    const temporaryInformation =
      (container.temporaryInformation as TemporaryInformation | undefined) ??
      ({
        closures: [],
        scheduleAdjustments: [],
        messages: [],
      } as TemporaryInformation);
    const legacyTempInfos = readLegacySnapshot(container, context)?.tempInfos;

    const tempInfos: LegacyTempInfos = {
      closure: this.buildLegacyClosure(
        temporaryInformation.closures,
        legacyTempInfos?.closure,
      ),
      hours: this.buildLegacyHours(
        temporaryInformation.scheduleAdjustments,
        legacyTempInfos?.hours,
      ),
      message: this.buildLegacyMessage(
        temporaryInformation.messages,
        legacyTempInfos?.message,
      ),
    };

    container.tempInfos = tempInfos;
    delete container.temporaryInformation;
  }

  private buildLegacyClosure(
    closures: TemporaryInformation['closures'],
    legacyClosure: LegacyTempInfos['closure'],
  ): LegacyTempInfos['closure'] {
    const dateRange = this.mergeDateRange(closures);
    if (!dateRange) {
      return legacyClosure;
    }

    return {
      actif: true,
      dateDebut: dateRange.startDate,
      dateFin: dateRange.endDate,
      description: this.mergeTexts(
        closures.map((closure) => closure.description),
        '\n\n',
      ),
    };
  }

  private buildLegacyHours(
    scheduleAdjustments: TemporaryInformation['scheduleAdjustments'],
    legacyHours: LegacyTempInfos['hours'],
  ): LegacyTempInfos['hours'] {
    const dateRange = this.mergeDateRange(scheduleAdjustments);
    if (!dateRange) {
      return legacyHours;
    }

    const representativeSchedule = [...scheduleAdjustments].sort(
      (left, right) => left.startDate.localeCompare(right.startDate),
    )[0]?.schedule;

    return {
      actif: true,
      dateDebut: dateRange.startDate,
      dateFin: dateRange.endDate,
      description: this.mergeTexts(
        scheduleAdjustments.map((adjustment) => adjustment.description),
        '\n\n',
      ),
      hours: representativeSchedule
        ? toLegacyOpeningHours(
            representativeSchedule,
            legacyHours?.hours ?? undefined,
          )
        : (legacyHours?.hours ?? undefined),
    };
  }

  private buildLegacyMessage(
    messages: TemporaryInformation['messages'],
    legacyMessage: LegacyTempInfos['message'],
  ): LegacyTempInfos['message'] {
    const dateRange = this.mergeDateRange(messages);
    if (!dateRange) {
      return legacyMessage;
    }

    return {
      actif: true,
      dateDebut: dateRange.startDate,
      dateFin: dateRange.endDate,
      description: this.mergeTexts(
        messages.map((message) => `${message.title}: ${message.description}`),
        '\n\n',
      ),
      name: this.mergeTexts(
        messages.map((message) => message.title),
        ' | ',
      ),
    };
  }

  private mergeDateRange(
    entries: ReadonlyArray<{ startDate: string; endDate: string }>,
  ): { startDate: string; endDate: string } | undefined {
    if (entries.length === 0) {
      return undefined;
    }

    return {
      startDate: entries.reduce(
        (lowest, entry) =>
          entry.startDate < lowest ? entry.startDate : lowest,
        entries[0].startDate,
      ),
      endDate: entries.reduce(
        (highest, entry) => (entry.endDate > highest ? entry.endDate : highest),
        entries[0].endDate,
      ),
    };
  }

  private mergeTexts(
    values: ReadonlyArray<string>,
    separator: string,
  ): string | undefined {
    const merged = values
      .map((value) => value.trim())
      .filter((value) => value.length > 0)
      .join(separator);

    return merged.length > 0 ? merged : undefined;
  }
}

export class ReplaceModalitiesByAccess extends CustomTransformChange {
  override description =
    'Replace legacy "modalities" with "access" in search response results to expose explicit and structured access rules consistent with the current API model.';
  override payloadPath = '/results/*' as const;

  protected override schemaPatchSet() {
    return {
      access: accessSchema,
    };
  }

  protected override schemaPatchRemove() {
    return ['modalities'];
  }

  override downgrade(
    container: Record<string, unknown>,
    context?: ResponseDowngradeContext,
  ) {
    const legacyModalities = readLegacySnapshot(container, context)?.modalities;
    container.modalities = toLegacyModalities(
      container.access as Access | undefined,
      legacyModalities,
    );
    delete container.access;
  }
}

export class ReplacePublicsByAudience extends CustomTransformChange {
  override description =
    'Replace legacy "publics" with "audience" in search response results to expose normalized audience eligibility and targeting rules aligned with the current API contract.';
  override payloadPath = '/results/*' as const;

  protected override schemaPatchSet() {
    return {
      audience: audienceSchema,
    };
  }

  protected override schemaPatchRemove() {
    return ['publics'];
  }

  override downgrade(
    container: Record<string, unknown>,
    context?: ResponseDowngradeContext,
  ) {
    const legacyPublics = readLegacySnapshot(container, context)?.publics;
    container.publics = toLegacyPublics(
      container.audience as Audience | undefined,
      legacyPublics,
    );
    delete container.audience;
  }
}

const itineraryStopSchema = z
  .object({
    description: z
      .string()
      .nullable()
      .describe('Additional information about this stop or route point.'),
    location: locationSchema.describe(
      'Location where the itinerary service is available for this stop.',
    ),
    schedule: scheduleSchema.describe(
      'Schedule during which the itinerary service is available at this stop.',
    ),
  })
  .strict();

const canonicalPlaceCommonSchema = z
  .object({
    name: z.string().describe('Localized name of the place.').meta({
      example: 'Community Support Center',
    }),
    description: z
      .string()
      .describe('Localized HTML content describing the place.')
      .meta({
        example:
          '<p>A support center providing food distribution and social services.</p>',
      }),
    isOpenToday: z
      .boolean()
      .describe('Whether the place is open today.')
      .meta({ example: true }),
    sourceLanguage: z.string().optional(),
    country: z.string().optional(),
    languages: z
      .array(z.string())
      .describe('Languages spoken at the place. Format ISO 639-3')
      .meta({ example: ['en', 'fr', 'rcf'] }),
    id: z.number().int().describe('Numeric place identifier.'),
    slug: z.string().describe('SEO-friendly unique slug for the place.'),
    updatedAt: z.iso
      .datetime()
      .describe('Last update date and time of this place in ISO 8601 format.')
      .meta({ example: '2026-03-26T10:15:00Z' }),
    contacts: z
      .array(contactSchema)
      .describe('Contact methods available for the place.'),
    services: z
      .array(serviceSchema)
      .describe('Services provided by the place.'),
    temporaryInformation: temporaryInformationSchema.describe(
      'Temporary changes affecting the place.',
    ),
    access: accessSchema.describe('Access rules applying to the place.'),
    audience: audienceSchema.describe(
      'Audience rules and targeting information.',
    ),
  })
  .strict();

const fixedLocationPlaceSchema = canonicalPlaceCommonSchema
  .extend({
    type: z.literal('fixedLocation').describe('Discriminates place shape.'),
    location: locationSchema.describe('Main location of the resource.'),
    schedule: scheduleSchema.describe('Main schedule of the resource.'),
  })
  .meta({ title: 'Fixed Location' });

const itineraryPlaceSchema = canonicalPlaceCommonSchema
  .extend({
    type: z.literal('itinerary').describe('Discriminates place shape.'),
    stops: z
      .array(itineraryStopSchema)
      .describe('Scheduled stops or route points.'),
  })
  .meta({ title: 'Itinerary' });

const placeSchemaByType = z
  .discriminatedUnion('type', [fixedLocationPlaceSchema, itineraryPlaceSchema])
  .describe(
    'Type-discriminated place payload. "fixedLocation" requires location/schedule; "itinerary" requires stops.',
  )
  .meta({
    discriminator: {
      propertyName: 'type',
    },
  });

export class RenameSearchResponseResultsCollection extends RenameFieldChange {
  override description =
    'Rename search response collection field from "places" to "results" to align the payload envelope with the canonical contract while preserving backward compatibility for version downgrades.';
  override payloadPath = '/' as const;
  override from = 'places';
  override to = 'results';
  override schema = z
    .array(
      z
        .object({})
        .loose()
        .describe('Intermediate place payload before schema migrations.'),
    )
    .describe(
      'List of matching place payloads while applying progressive schema migrations.',
    );
}

export class ReplaceLegacyPlaceTypeByTypeDiscriminatedBranches extends CustomTransformChange {
  override description =
    'Replace legacy place-type representation with a type-discriminated schema so "itinerary" always requires "stops" and "fixedLocation" always requires "location" and "schedule", preventing structurally ambiguous place payloads.';
  override payloadPath = '/results/*' as const;

  protected override schemaPatchReplace() {
    return placeSchemaByType;
  }

  override downgrade(
    container: Record<string, unknown>,
    context?: ResponseDowngradeContext,
  ) {
    const type = container.type;
    const legacyPlace = readLegacySnapshot(container, context);

    if (type === 'fixedLocation') {
      if (!container.location || !container.schedule) {
        throw new Error(
          'Invalid fixedLocation payload: both "location" and "schedule" are required.',
        );
      }

      container.placeType = PlaceType.PLACE;
      container.position = this.toLegacyPosition(
        container.location as Location,
      );
      container.newhours = this.toLegacyOpeningHours(
        container.schedule as Schedule,
        legacyPlace?.newhours,
      );
      delete container.location;
      delete container.schedule;
      delete container.stops;
      delete container.type;
      return;
    }

    if (type === 'itinerary') {
      if (!Array.isArray(container.stops)) {
        throw new Error(
          'Invalid itinerary payload: "stops" is required and must be an array.',
        );
      }

      container.placeType = PlaceType.ITINERARY;
      container.parcours = container.stops.map((stop, index) => {
        const typedStop = stop as {
          description: string | null;
          location: Location;
          schedule: Schedule;
        };
        const legacyStop = legacyPlace?.parcours?.[index];

        return {
          description: typedStop.description,
          position: this.toLegacyPosition(typedStop.location),
          hours: this.toLegacyOpeningHours(
            typedStop.schedule,
            legacyStop?.hours,
          ),
          show: this.resolveLegacyParcoursVisibility(
            typedStop,
            legacyStop?.show,
          ),
        };
      }) as LegacyParcours;
      delete container.stops;
      delete container.location;
      delete container.schedule;
      delete container.type;
      return;
    }

    throw new Error(
      'Invalid place payload: "type" must be either "fixedLocation" or "itinerary".',
    );
  }

  private toLegacyPosition(location: Location): LegacyPosition {
    return {
      location: {
        type: 'Point',
        coordinates: location.location.coordinates,
      },
      address: location.address,
      additionalInformation: location.additionalInformation,
      city: location.city,
      postalCode: location.postalCode,
      department: location.department,
      departmentCode: location.departmentCode,
      region: location.region,
      regionCode: location.regionCode,
      country: location.country,
      timeZone: location.timeZone,
    };
  }

  private toLegacyOpeningHours(
    schedule: Schedule,
    legacyOpeningHours: LegacyOpeningHours | undefined,
  ): LegacyOpeningHours {
    return toLegacyOpeningHours(schedule, legacyOpeningHours);
  }

  private resolveLegacyParcoursVisibility(
    stop: {
      description: string | null;
      schedule: Schedule;
    },
    legacyShow: boolean | undefined,
  ): boolean {
    if (typeof legacyShow === 'boolean') {
      return legacyShow;
    }

    if (stop.description && stop.description.trim().length > 0) {
      return true;
    }

    return stop.schedule.weeklySchedule.some(
      (day) => day.status === 'open' || day.timeSlots.length > 0,
    );
  }
}

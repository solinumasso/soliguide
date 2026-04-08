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
} from '../../../../../api-versioning/versioning';
import { type Contact, contactSchema } from './contact';
import { type Service, serviceSchema } from './service';
import { type Access, accessSchema } from './access';
import { type Audience, audienceSchema } from './audience';
import { type Location, locationSchema } from './location';
import { type Schedule, scheduleSchema } from './schedule';
import {
  type TemporaryInformation,
  temporaryInformationSchema,
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

export class RenameUniqueIdentifier extends RenameFieldChange {
  override description =
    'Rename place field "lieu_id" to "id" in search response results to align with the canonical identifier naming in the current API and remove legacy field naming.';
  override payloadPath = '/places/*' as const;
  override from = 'lieu_id';
  override to = 'id';
  override schema = z.number().int().describe('Numeric place identifier.');
}

export class RemoveMongoObjectId extends RemoveFieldChange {
  override description =
    'Remove deprecated MongoDB identifier "_id" from search response results so the public contract exposes only business identifiers and does not leak persistence-layer implementation details.';
  override payloadPath = '/places/*' as const;
  override field = '_id';

  override downgrade() {
    return undefined;
  }
}

export class RemoveLegacyAutoFlag extends RemoveFieldChange {
  override description =
    'Remove legacy "auto" flag from search response results because this internal automation marker is not part of the public API contract.';
  override payloadPath = '/places/*' as const;
  override field = 'auto';

  override downgrade() {
    return undefined;
  }
}

export class RemoveLegacyStatusField extends RemoveFieldChange {
  override description =
    'Remove legacy "status" field from search response results to avoid exposing back-office lifecycle state that is not part of the current public model.';
  override payloadPath = '/places/*' as const;
  override field = 'status';

  override downgrade() {
    return undefined;
  }
}

export class RemoveLegacyVisibilityField extends RemoveFieldChange {
  override description =
    'Remove legacy "visibility" field from search response results to keep visibility management concerns out of the public response contract.';
  override payloadPath = '/places/*' as const;
  override field = 'visibility';

  override downgrade() {
    return undefined;
  }
}

export class RemoveLegacyCloseField extends RemoveFieldChange {
  override description =
    'Remove legacy "close" field from search response results because open-state information is now represented through normalized schedule and temporary-information models.';
  override payloadPath = '/places/*' as const;
  override field = 'close';

  override downgrade() {
    return undefined;
  }
}

export class RemoveLegacySourcesField extends RemoveFieldChange {
  override description =
    'Remove legacy "sources" field from search response results to prevent leaking internal provenance metadata that is not exposed in the current API.';
  override payloadPath = '/places/*' as const;
  override field = 'sources';

  override downgrade() {
    return undefined;
  }
}

export class RemoveLegacyUpdatedByUserAtField extends RemoveFieldChange {
  override description =
    'Remove legacy "updatedByUserAt" field from search response results because the public API exposes only a single canonical update timestamp.';
  override payloadPath = '/places/*' as const;
  override field = 'updatedByUserAt';

  override downgrade() {
    return undefined;
  }
}

export class RemoveLegacySlugsField extends RemoveFieldChange {
  override description =
    'Remove legacy "slugs" object from search response results after introducing the normalized "slug" field, avoiding duplicate SEO identifiers.';
  override payloadPath = '/places/*' as const;
  override field = 'slugs';

  override downgrade() {
    return undefined;
  }
}

export class RemoveLegacyDistanceField extends RemoveFieldChange {
  override description =
    'Remove legacy "distance" field from search response results because distance presentation is query-context dependent and not part of the canonical place resource schema.';
  override payloadPath = '/places/*' as const;
  override field = 'distance';

  override downgrade() {
    return undefined;
  }
}

export class RemoveLegacyPhotosField extends RemoveFieldChange {
  override description =
    'Remove legacy "photos" field from search response results to keep the minimal search payload focused on normalized resource information.';
  override payloadPath = '/places/*' as const;
  override field = 'photos';

  override downgrade() {
    return undefined;
  }
}

export class RemoveLegacyGeoZonesField extends RemoveFieldChange {
  override description =
    'Remove legacy "geoZones" field from search response results because geographic targeting details are not part of the public search response contract.';
  override payloadPath = '/places/*' as const;
  override field = 'geoZones';

  override downgrade() {
    return undefined;
  }
}

export class RemoveLegacyCreatedAtField extends RemoveFieldChange {
  override description =
    'Remove legacy "createdAt" field from search response results to keep temporal metadata aligned with the single public "updatedAt" reference date.';
  override payloadPath = '/places/*' as const;
  override field = 'createdAt';

  override downgrade() {
    return undefined;
  }
}

export class RenameSeoUrl extends RenameFieldChange {
  override description =
    'Rename place field "seo_url" to "slug" in search response results to standardize SEO identifier naming with the current schema and improve API readability.';
  override payloadPath = '/places/*' as const;
  override from = 'seo_url';
  override to = 'slug';
  override schema = z
    .string()
    .describe('SEO-friendly unique slug for the place.');
}

export class IsoFormatOnUpdatedAt extends ReplaceFieldChange {
  override description =
    'Replace "updatedAt" by an ISO 8601 datetime string to provide a stable and locale-independent timestamp format that matches the current response contract.';
  override payloadPath = '/places/*' as const;
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
  override payloadPath = '/places/*' as const;

  protected override schemaPatchSet() {
    return {
      contacts: z
        .array(contactSchema)
        .describe('Contact methods available for the place.'),
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
  override payloadPath = '/places/*' as const;

  protected override schemaPatchSet() {
    return {
      services: z
        .array(serviceSchema)
        .describe('Services provided by the place.'),
    };
  }

  protected override schemaPatchRemove() {
    return ['services_all'];
  }

  override downgrade(container: Record<string, unknown>) {
    const services: Service[] = (container.services as Service[]) ?? [];
    const fallbackCreatedAt = container.updatedAt ?? new Date().toISOString();

    container.services_all = services.map((service) => ({
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
      // TODO(vNext): current "services" has no per-service creation timestamp.
      createdAt: fallbackCreatedAt,
      serviceObjectId: service.id,
      // TODO(vNext): current "access"/"audience"/"schedule" shapes are not reversible to legacy formats.
      modalities: undefined,
      publics: undefined,
      hours: undefined,
    })) as LegacyService[];

    delete container.services;
  }
}

export class ReplaceTempInfosByTemporaryInformation extends CustomTransformChange {
  override description =
    'Replace legacy "tempInfos" with "temporaryInformation" in search response results to expose a normalized temporary-information model with explicit collections for closures, schedule adjustments, and messages.';
  override payloadPath = '/places/*' as const;

  protected override schemaPatchSet() {
    return {
      temporaryInformation: temporaryInformationSchema.describe(
        'Temporary changes affecting the place.',
      ),
    };
  }

  protected override schemaPatchRemove() {
    return ['tempInfos'];
  }

  override downgrade(container: Record<string, unknown>) {
    const temporaryInformation =
      container.temporaryInformation as TemporaryInformation;

    const firstClosure = temporaryInformation.closures[0];
    const firstScheduleAdjustment = temporaryInformation.scheduleAdjustments[0];
    const firstMessage = temporaryInformation.messages[0];

    const tempInfos: LegacyTempInfos = {
      // TODO(vNext): legacy "tempInfos.closure" supports only one item; additional closures are dropped.
      closure: firstClosure
        ? {
            actif: true,
            dateDebut: firstClosure.startDate,
            dateFin: firstClosure.endDate,
            description: firstClosure.description,
          }
        : undefined,
      // TODO(vNext): legacy "tempInfos.hours" supports only one item; additional adjustments are dropped.
      hours: firstScheduleAdjustment
        ? {
            actif: true,
            dateDebut: firstScheduleAdjustment.startDate,
            dateFin: firstScheduleAdjustment.endDate,
            description: firstScheduleAdjustment.description,
            // TODO(vNext): current "schedule" shape is not reversible to legacy opening-hours format.
            hours: undefined,
          }
        : undefined,
      // TODO(vNext): legacy "tempInfos.message" supports only one item; additional messages are dropped.
      message: firstMessage
        ? {
            actif: true,
            dateDebut: firstMessage.startDate,
            dateFin: firstMessage.endDate,
            description: firstMessage.description,
            name: firstMessage.title,
          }
        : undefined,
    } as LegacyTempInfos;

    container.tempInfos = tempInfos;
    delete container.temporaryInformation;
  }
}

export class ReplaceModalitiesByAccess extends CustomTransformChange {
  override description =
    'Replace legacy "modalities" with "access" in search response results to expose explicit and structured access rules consistent with the current API model.';
  override payloadPath = '/places/*' as const;

  protected override schemaPatchSet() {
    return {
      access: accessSchema.describe('Access rules applying to the place.'),
    };
  }

  protected override schemaPatchRemove() {
    return ['modalities'];
  }

  override downgrade(container: Record<string, unknown>) {
    const access = container.access as Access;

    const modalities: LegacyModalities = {
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
      // TODO(vNext): legacy "modalities.docs" has no equivalent in current "access" model.
      docs: undefined,
      other: access.otherDetails,
    };

    container.modalities = modalities;
    delete container.access;
  }
}

export class ReplacePublicsByAudience extends CustomTransformChange {
  override description =
    'Replace legacy "publics" with "audience" in search response results to expose normalized audience eligibility and targeting rules aligned with the current API contract.';
  override payloadPath = '/places/*' as const;

  protected override schemaPatchSet() {
    return {
      audience: audienceSchema.describe(
        'Audience rules and targeting information.',
      ),
    };
  }

  protected override schemaPatchRemove() {
    return ['publics'];
  }

  override downgrade(container: Record<string, unknown>) {
    const audience = container.audience as Audience;

    const otherStatusesToLegacyMap: Record<Audience['otherStatuses'], string> =
      {
        violence: 'violence',
        addiction: 'addiction',
        disability: 'disability',
        'lgbt+': 'lgbtqPlus',
        hiv: 'hiv',
        prostitution: 'sexWork',
        prison: 'prison',
        student: 'student',
      };

    const publics: LegacyPublics = {
      // TODO(vNext): "audience" cannot distinguish legacy PREFERENTIAL (1) vs EXCLUSIVE (2) precisely.
      accueil:
        audience.admissionPolicy === 'open' ? 0 : audience.isTargeted ? 2 : 1,
      administrative: [audience.administrativeStatuses],
      familialle: [audience.familyStatuses],
      other: [otherStatusesToLegacyMap[audience.otherStatuses]],
      gender: [audience.genders],
      age: audience.ageRange
        ? {
            min: audience.ageRange.min,
            max: audience.ageRange.max,
          }
        : undefined,
      description: audience.description,
      // TODO(vNext): "specialSupportContexts" has no equivalent in legacy "publics" model.
    };

    container.publics = publics;
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

const fixedLocationPlaceSchema = z
  .object({
    type: z.literal('fixedLocation'),
    location: locationSchema.describe('Main location of the resource.'),
    schedule: scheduleSchema.describe('Main schedule of the resource.'),
  })
  .loose();

const itineraryPlaceSchema = z
  .object({
    type: z.literal('itinerary'),
    stops: z
      .array(itineraryStopSchema)
      .describe(
        'Scheduled stops or route points where the itinerary service is available.',
      ),
  })
  .loose();

const placeTypeDiscriminatedSchema = z
  .discriminatedUnion('type', [fixedLocationPlaceSchema, itineraryPlaceSchema])
  .meta({
    discriminator: {
      propertyName: 'type',
    },
  });

export class ReplaceLegacyPlaceTypeByTypeDiscriminatedBranches extends CustomTransformChange {
  override description =
    'Replace legacy place-type representation with a type-discriminated schema so "itinerary" always requires "stops" and "fixedLocation" always requires "location" and "schedule", preventing structurally ambiguous place payloads.';
  override payloadPath = '/places/*' as const;

  protected override schemaPatchReplace() {
    return placeTypeDiscriminatedSchema;
  }

  override downgrade(container: Record<string, unknown>) {
    const type = container.type;

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
      container.parcours = container.stops.map((stop) => {
        const typedStop = stop as {
          description: string | null;
          location: Location;
          schedule: Schedule;
        };

        return {
          description: typedStop.description,
          position: this.toLegacyPosition(typedStop.location),
          hours: this.toLegacyOpeningHours(typedStop.schedule),
          // TODO(vNext): current itinerary stop has no legacy "show" flag source.
          show: true,
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

  private toLegacyOpeningHours(schedule: Schedule): LegacyOpeningHours {
    const openingHours: LegacyOpeningHours = {
      closedHolidays: this.toLegacyClosedHolidays(
        schedule.publicHolidays.status,
      ),
    };
    const openingHoursByDay = openingHours as Record<string, unknown>;

    for (const day of schedule.weeklySchedule) {
      openingHoursByDay[day.dayOfWeek] = {
        open: day.status === 'open',
        timeslot: day.timeSlots.map((slot) => ({
          start: this.toLegacyTimeNumber(slot.startTime),
          end: this.toLegacyTimeNumber(slot.endTime),
        })),
      };
    }

    return openingHours;
  }

  private toLegacyClosedHolidays(
    status: Schedule['publicHolidays']['status'],
  ): PlaceClosedHolidays {
    if (status === 'open') {
      return PlaceClosedHolidays.OPEN;
    }

    if (status === 'closed') {
      return PlaceClosedHolidays.CLOSED;
    }

    // TODO(vNext): current "specific" holiday strategy cannot be represented in legacy enum.
    return PlaceClosedHolidays.UNKNOWN;
  }

  private toLegacyTimeNumber(value: string): number {
    const [hoursRaw, minutesRaw] = value.split(':');
    const hours = Number.parseInt(hoursRaw ?? '0', 10);
    const minutes = Number.parseInt(minutesRaw ?? '0', 10);
    return hours * 100 + minutes;
  }
}

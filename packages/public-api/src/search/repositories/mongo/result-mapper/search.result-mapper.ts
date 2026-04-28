import { Injectable } from "@nestjs/common";

import type {
  MongoModalitiesCheck,
  MongoOpeningHours,
  MongoObjectIdLike,
  MongoModalities,
  MongoPublics,
  MongoTempInfo,
  MongoTempInfoBase,
  MongoDayOpeningHours,
  MongoTimeslot,
  MongoPlace,
  MongoService,
  MongoParcours,
  MongoPhoto,
  MongoSource,
  MongoSourceId,
  MongoPosition,
  MongoEntity,
  MongoPhone,
  MongoPlaceSlugs,
} from "../place.mongo";

import type {
  SearchEntity,
  SearchDayOpeningHours,
  SearchModalities,
  SearchModalitiesCheck,
  SearchOpeningHours,
  SearchParcours,
  SearchPhoto,
  SearchPlace,
  SearchPosition,
  SearchPublics,
  SearchResult,
  SearchService,
  SearchSpecialSupportContext,
  SearchSlugs,
  SearchSource,
  SearchSourceId,
  SearchTempInfo,
  SearchTempInfoBase,
  SearchTimeslot,
} from "../../../search-result/search-result.type";
import {
  PublicsAdministrative,
  PublicsFamily,
  PublicsGender,
  PublicsOther,
} from "@soliguide/common";

@Injectable()
export class SearchResultMapper {
  map(mongoResult: MongoSearchRawResult): SearchResult {
    return {
      nbResults: mongoResult.countResult?.[0]?.totalResults ?? 0,
      places: mongoResult.places.map((place) => this.mapPlace(place)),
    };
  }

  private mapPlace(place: MongoPlace): SearchPlace {
    const mappedPlace = this.compact({
      _id: this.normalizeId(place._id),
      lieu_id: place.lieu_id,
      seoUrl: place.seo_url,
      name: place.name,
      description: place.description,
      status: place.status,
      visibility: place.visibility,
      isOpenToday: place.isOpenToday,
      photos: this.mapPhotos(place.photos),
      placeType: place.placeType,
      services: place.services_all?.map((service) => this.mapService(service)),
      position: this.mapPosition(place.position),
      waypoints: place.parcours?.map((parcours) => this.mapParcours(parcours)),
      organizationInfo: this.mapEntity(place.entity),
      openingHours: this.mapOpeningHours(place.newhours),
      modalities: this.mapModalities(place.modalities),
      publics: this.mapPublics(place.publics),
      country: place.country,
      languages: place.languages,
      createdAt: place.createdAt?.toISOString(),
      updatedAt: place.updatedAt?.toISOString(),
      updatedByUserAt: place.updatedByUserAt?.toISOString(),
      tempInfo: this.mapTempInfo(place.tempInfos),
      sources: place.sources?.map((source) => this.mapSource(source)),
      slugs: this.mapSlugs(place.slugs),
      distance: place.distance,
    });

    if (place.placeType === "LIEU") {
      delete mappedPlace.waypoints;
    }

    if (place.placeType === "PARCOURS_MOBILE") {
      delete mappedPlace.openingHours;
      delete mappedPlace.position;
    }

    return mappedPlace;
  }

  private mapService(service: MongoService): SearchService {
    const serviceObjectId = this.normalizeId(service.serviceObjectId);

    if (!serviceObjectId) {
      throw new TypeError(
        "Service serviceObjectId must be a string or ObjectId-like value"
      );
    }

    return this.compact({
      category: service.category,
      tempClosure: service.close
        ? this.compact({
            active: service.close.actif,
            startDate: service.close.dateDebut?.toISOString(),
            endDate: service.close.dateFin?.toISOString(),
          })
        : undefined,
      description: service.description,
      differentHours: service.differentHours,
      differentModalities: service.differentModalities,
      differentPublics: service.differentPublics,
      hours: this.mapOpeningHours(service.hours),
      isOpenToday: service.isOpenToday,
      modalities: this.mapModalities(service.modalities),
      publics: this.mapPublics(service.publics),
      saturated: service.saturated
        ? this.compact({
            precision: service.saturated.precision,
            status: service.saturated.status,
          })
        : undefined,
      serviceObjectId,
      createdAt: service.createdAt?.toISOString(),
      categorySpecificFields: service.categorySpecificFields
        ? this.compact({ ...service.categorySpecificFields })
        : undefined,
      name: service.name,
    });
  }

  private mapParcours(parcours: MongoParcours): SearchParcours {
    return this.compact({
      description: parcours.description,
      hours: this.mapOpeningHours(parcours.hours),
      position: this.mapPosition(parcours.position),
      photos: this.mapPhotos(parcours.photos),
      show: parcours.show,
    });
  }

  private mapPhotos(photos?: MongoPhoto[]): SearchPhoto[] | null {
    if (!photos) {
      return null;
    }

    const mappedPhotos = photos
      .map((photo) => this.mapPhoto(photo))
      .filter((photo): photo is SearchPhoto => photo !== undefined);

    return mappedPhotos.length > 0 ? mappedPhotos : null;
  }

  private mapPhoto(photo: MongoPhoto): SearchPhoto | null {
    return this.compact({
      _id: this.normalizeId(photo._id),
      encoding: photo.encoding,
      filename: photo.filename,
      mimetype: photo.mimetype,
      parcours_id: photo.parcours_id,
      path: photo.path,
      lieu_id: photo.lieu_id,
      size: photo.size,
      createdAt: photo.createdAt?.toISOString(),
      updatedAt: photo.updatedAt?.toISOString(),
    });
  }

  private mapSource(source: MongoSource): SearchSource {
    return this.compact({
      ids: source.ids?.map((id: MongoSourceId) => this.mapSourceId(id)),
      isOrigin: source.isOrigin,
      license: source.license,
      name: source.name,
    });
  }

  private mapSourceId(sourceId: MongoSourceId): SearchSourceId {
    const id = this.normalizeId(sourceId.id);

    if (!id) {
      throw new TypeError("Source id must be a string or ObjectId-like value");
    }

    return this.compact({
      id,
      url: sourceId.url,
    });
  }

  private mapPosition(position: MongoPosition): SearchPosition | undefined {
    if (!position) {
      return null;
    }

    return this.compact({
      location: position.location
        ? this.compact({
            type: position.location.type,
            coordinates: position.location.coordinates,
          })
        : undefined,
      address: position.address,
      additionalInformation: position.additionalInformation,
      city: position.city,
      cityCode: position.cityCode,
      postalCode: position.postalCode,
      department: position.department,
      departmentCode: position.departmentCode,
      region: position.region,
      regionCode: position.regionCode,
      country: position.country,
      timeZone: position.timeZone,
    });
  }

  private mapEntity(entity: MongoEntity): SearchEntity | undefined {
    if (!entity) {
      return null;
    }

    return this.compact({
      facebook: entity.facebook,
      fax: entity.fax,
      instagram: entity.instagram,
      mail: entity.mail,
      name: entity.name,
      phones: entity.phones?.map((phone: MongoPhone) =>
        this.compact({
          label: phone.label,
          phoneNumber: phone.phoneNumber,
          countryCode: phone.countryCode,
          isSpecialPhoneNumber: phone.isSpecialPhoneNumber,
        })
      ),
      website: entity.website,
    });
  }

  private mapOpeningHours(
    hours: MongoOpeningHours | null | undefined
  ): SearchOpeningHours | null {
    if (!hours) {
      return null;
    }

    return this.compact({
      closedHolidays: hours.closedHolidays,
      description: hours.description,
      monday: this.mapDayOpeningHours(hours.monday),
      tuesday: this.mapDayOpeningHours(hours.tuesday),
      wednesday: this.mapDayOpeningHours(hours.wednesday),
      thursday: this.mapDayOpeningHours(hours.thursday),
      friday: this.mapDayOpeningHours(hours.friday),
      saturday: this.mapDayOpeningHours(hours.saturday),
      sunday: this.mapDayOpeningHours(hours.sunday),
    });
  }

  private mapDayOpeningHours(
    day: MongoDayOpeningHours | null | undefined
  ): SearchDayOpeningHours | null {
    if (!day) {
      return null;
    }

    return this.compact({
      open: day.open,
      timeslot: day.timeslot?.map((timeslot) => this.mapTimeslot(timeslot)),
    });
  }

  private mapTimeslot(timeslot: MongoTimeslot): SearchTimeslot {
    return this.compact({
      end: timeslot.end,
      start: timeslot.start,
    });
  }

  private mapModalities(
    modalities: MongoModalities | null | undefined
  ): SearchModalities | null {
    if (!modalities) {
      return null;
    }

    return this.compact({
      unconditional: modalities.inconditionnel,
      appointment: this.mapModalitiesCheck(modalities.appointment),
      registration: this.mapModalitiesCheck(modalities.inscription),
      referral: this.mapModalitiesCheck(modalities.orientation),
      price: this.mapModalitiesCheck(modalities.price),
      animals: modalities.animal
        ? this.compact({ checked: modalities.animal.checked })
        : undefined,
      accessibility: modalities.pmr
        ? this.compact({ wheelchair: modalities.pmr.checked })
        : undefined,
      docs: modalities.docs
        ?.map((doc) => this.normalizeId(doc))
        .filter((doc): doc is string => typeof doc === "string"),
      other: modalities.other,
      _text: null,
    });
  }

  private mapModalitiesCheck(
    value: MongoModalitiesCheck | null | undefined
  ): SearchModalitiesCheck | null {
    if (!value) {
      return null;
    }

    return this.compact({
      checked: value.checked,
      precisions: value.precisions,
    });
  }

  private mapPublics(
    publics: MongoPublics | null | undefined
  ): SearchPublics | null {
    if (!publics) {
      return null;
    }

    return this.compact({
      welcomeType: publics.accueil,
      administrative: publics.administrative as PublicsAdministrative[],
      age: publics.age
        ? this.compact({
            max: publics.age.max,
            min: publics.age.min,
          })
        : undefined,
      description: publics.description,
      family: publics.familialle as PublicsFamily[],
      gender: publics.gender as PublicsGender[],
      other: publics.other as PublicsOther[],
      specialSupportContext: this.mapSpecialSupportContext(
        publics.ukrainePrecisions
      ),
      _text: null,
    });
  }

  private mapSpecialSupportContext(
    details: string | null | undefined
  ): SearchSpecialSupportContext | null {
    if (!details) {
      return null;
    }

    return {
      type: "humanitarianCrisis",
      key: "ukraine-displacement",
      label: "Support for displaced people from Ukraine",
      details,
    };
  }

  private mapTempInfo(
    tempInfo: MongoTempInfo | undefined
  ): SearchTempInfo | null {
    if (!tempInfo) {
      return null;
    }

    return this.compact({
      closure: this.mapTempInfoBase(tempInfo.closure),
      hours: tempInfo.hours
        ? this.compact({
            ...this.mapTempInfoBase(tempInfo.hours),
            hours: this.mapOpeningHours(tempInfo.hours.hours),
          })
        : null,
      message: tempInfo.message
        ? this.compact({
            ...this.mapTempInfoBase(tempInfo.message),
            name: tempInfo.message.name,
          })
        : null,
    });
  }

  private mapTempInfoBase(
    tempInfo: MongoTempInfoBase | null | undefined
  ): SearchTempInfoBase | null {
    if (!tempInfo) {
      return null;
    }

    return this.compact({
      active: tempInfo.actif,
      startDate: tempInfo.dateDebut?.toISOString(),
      endDate: tempInfo.dateFin?.toISOString(),
      description: tempInfo.description,
    });
  }

  private mapSlugs(slugs: MongoPlaceSlugs): SearchSlugs | undefined {
    if (!slugs) {
      return undefined;
    }

    return this.compact({
      infos: slugs.infos
        ? this.compact({
            description: slugs.infos.description,
            name: slugs.infos.name,
          })
        : undefined,
    });
  }

  private normalizeId(
    value: string | MongoObjectIdLike | undefined
  ): string | null {
    if (!value) {
      return null;
    }

    if (typeof value === "string") {
      return value;
    }

    if (typeof value.toHexString === "function") {
      return value.toHexString();
    }

    return value.toString();
  }

  private compact<T extends Record<string, unknown>>(value: T): T {
    return Object.fromEntries(
      Object.entries(value).filter(
        ([, currentValue]) =>
          currentValue !== undefined && currentValue !== null
      )
    ) as T;
  }
}

type MongoSearchRawResult = {
  places: MongoPlace[];
  countResult: Array<{ totalResults?: number }>;
};

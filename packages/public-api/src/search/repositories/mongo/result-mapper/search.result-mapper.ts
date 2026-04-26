import { Injectable } from "@nestjs/common";

import type {
  MongoGeoZone,
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
  SearchDayOpeningHours,
  SearchEntity,
  SearchGeoZone,
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
    return this.compact({
      _id: this.normalizeId(place._id),
      lieu_id: place.lieu_id,
      seo_url: place.seo_url,
      name: place.name,
      description: place.description,
      status: place.status,
      visibility: place.visibility,
      isOpenToday: place.isOpenToday,
      photos: this.mapPhotos(place.photos),
      placeType: place.placeType,
      services_all: place.services_all?.map((service) =>
        this.mapService(service)
      ),
      position: this.mapPosition(place.position),
      parcours: place.parcours?.map((parcours) => this.mapParcours(parcours)),
      entity: this.mapEntity(place.entity),
      geoZones: place.geoZones?.map((geoZone: MongoGeoZone) =>
        this.mapGeoZone(geoZone)
      ),
      newhours: this.mapOpeningHours(place.newhours),
      modalities: this.mapModalities(place.modalities),
      publics: this.mapPublics(place.publics),
      country: place.country,
      languages: place.languages,
      createdAt: place.createdAt?.toISOString(),
      updatedAt: place.updatedAt?.toISOString(),
      updatedByUserAt: place.updatedByUserAt?.toISOString(),
      tempInfos: this.mapTempInfo(place.tempInfos),
      sources: place.sources?.map((source) => this.mapSource(source)),
      slugs: this.mapSlugs(place.slugs),
      distance: place.distance,
    });
  }

  private mapService(service: MongoService): SearchService {
    const serviceObjectId = this.normalizeId(service.serviceObjectId);

    if (!serviceObjectId) {
      throw new TypeError(
        "Service serviceObjectId must be a string or ObjectId-like value"
      );
    }

    return this.compact({
      categorie: service.categorie,
      category: service.category,
      close: service.close
        ? this.compact({
            actif: service.close.actif,
            dateDebut: service.close.dateDebut?.toISOString(),
            dateFin: service.close.dateFin?.toISOString(),
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
      jobsList: service.jobsList,
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
      adresse: position.adresse,
      codePostal: position.codePostal,
      complementAdresse: position.complementAdresse,
      departement: position.departement,
      pays: position.pays,
      ville: position.ville,
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

  private mapGeoZone(geoZone: MongoGeoZone): SearchGeoZone {
    return this.compact({
      geoType: geoZone.geoType,
      geoValue: geoZone.geoValue,
      label: geoZone.label,
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
      inconditionnel: modalities.inconditionnel,
      appointment: this.mapModalitiesCheck(modalities.appointment),
      inscription: this.mapModalitiesCheck(modalities.inscription),
      orientation: this.mapModalitiesCheck(modalities.orientation),
      price: this.mapModalitiesCheck(modalities.price),
      animal: modalities.animal
        ? this.compact({ checked: modalities.animal.checked })
        : undefined,
      pmr: modalities.pmr
        ? this.compact({ checked: modalities.pmr.checked })
        : undefined,
      docs: modalities.docs
        ?.map((doc) => this.normalizeId(doc))
        .filter((doc): doc is string => typeof doc === "string"),
      other: modalities.other,
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
      accueil: publics.accueil,
      administrative: publics.administrative as PublicsAdministrative[],
      age: publics.age
        ? this.compact({
            max: publics.age.max,
            min: publics.age.min,
          })
        : undefined,
      description: publics.description,
      familialle: publics.familialle as PublicsFamily[],
      gender: publics.gender as PublicsGender[],
      other: publics.other as PublicsOther[],
    });
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
      actif: tempInfo.actif,
      dateDebut: tempInfo.dateDebut?.toISOString(),
      dateFin: tempInfo.dateFin?.toISOString(),
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
        ([, currentValue]) => currentValue !== undefined
      )
    ) as T;
  }
}

type MongoSearchRawResult = {
  places: MongoPlace[];
  countResult: Array<{ totalResults?: number }>;
};

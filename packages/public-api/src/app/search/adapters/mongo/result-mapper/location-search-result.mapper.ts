import { type SearchLocation } from '../../../search.types';
import { type MongoPosition } from '../place.mongo';

export class LocationSearchResultMapper {
  map(position?: MongoPosition): SearchLocation {
    const coordinates = position?.location?.coordinates;
    const longitude =
      Array.isArray(coordinates) && typeof coordinates[0] === 'number'
        ? coordinates[0]
        : 0;
    const latitude =
      Array.isArray(coordinates) && typeof coordinates[1] === 'number'
        ? coordinates[1]
        : 0;

    return {
      address: position?.address ?? position?.adresse ?? '',
      additionalInformation:
        position?.additionalInformation ?? position?.complementAdresse ?? '',
      postalCode: position?.postalCode ?? position?.codePostal ?? '',
      city: position?.city ?? position?.ville ?? '',
      country: position?.country ?? position?.pays ?? '',
      timeZone: position?.timeZone ?? 'UTC',
      department: position?.department ?? '',
      departmentCode: position?.departmentCode ?? '',
      region: position?.region ?? '',
      regionCode: position?.regionCode ?? '',
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    };
  }
}

import { type Document } from 'mongodb';

import {
  type SearchContext,
  type SearchQueryBuilder,
} from './search.query-builder';
import { appendAndConditions, buildMatchStage } from './utils';
import { CountryCodes, slugLocation } from '@soliguide/common';

export class LocationQueryBuilder implements SearchQueryBuilder {
  build(context: SearchContext): SearchContext {
    const query = context.query;
    const conditions: Document[] = [];
    const country = this.normalizeCountry(query.location?.country);
    if (country) {
      conditions.push({ 'position.country': country });
    }

    const regionCode = query.location?.administrativeDivision?.regionCode;
    if (regionCode) {
      conditions.push({
        'position.regionCode': regionCode,
      });
    }

    const region = query.location?.administrativeDivision?.region;
    const normalizedRegion = this.normalizeSlug(region);
    if (normalizedRegion) {
      conditions.push({
        'position.slugs.region': normalizedRegion,
      });
    }

    const departmentCode =
      query.location?.administrativeDivision?.departmentCode;
    if (departmentCode) {
      conditions.push({
        'position.departmentCode': departmentCode,
      });
    }

    const department = query.location?.administrativeDivision?.department;
    const normalizedDepartment = this.normalizeSlug(department);
    if (normalizedDepartment) {
      conditions.push({
        'position.slugs.department': normalizedDepartment,
      });
    }

    const cityValue = query.location?.city?.value;
    if (cityValue) {
      const cityType = query.location?.city?.type;
      if (cityType === 'postalCode') {
        conditions.push({ 'position.postalCode': cityValue });
      } else {
        const normalizedCity = this.normalizeSlug(cityValue);
        if (normalizedCity) {
          conditions.push({
            'position.slugs.city': normalizedCity,
          });
        }
      }
    }

    const nextContext = appendAndConditions(context, conditions);

    const latitude = query.location?.coordinates?.latitude;
    const longitude = query.location?.coordinates?.longitude;
    if (latitude === undefined || longitude === undefined) {
      return nextContext;
    }

    const radiusKm = query.location?.radiusKm;
    const maxDistance =
      typeof radiusKm === 'number' && radiusKm > 0 ? radiusKm * 1000 : null;

    return {
      ...nextContext,
      geoNearStage: {
        near: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        distanceField: 'distance',
        spherical: true,
        ...(maxDistance ? { maxDistance } : {}),
        key: 'position.location',
        query: buildMatchStage(nextContext.andConditions),
      },
    };
  }

  private normalizeCountry(country: string | undefined): string {
    return (country ?? CountryCodes.FR).trim().toLowerCase();
  }

  private normalizeSlug(value: string | undefined): string {
    return value ? slugLocation(value) : '';
  }
}

import { type Document } from 'mongodb';
import {
  type SearchContext,
  type SearchQueryBuilder,
} from './search.query-builder';
import { appendAndConditions } from './utils';

export class LocationQueryBuilder implements SearchQueryBuilder {
  build(context: SearchContext): SearchContext {
    const query = context.query;
    const conditions: Document[] = [];

    if (query.locationMode === 'country') {
      const country = query.country;
      if (country) {
        conditions.push({ 'position.country': country });
      }
      return appendAndConditions(context, conditions);
    }

    if (query.locationMode === 'administrativeDivision') {
      const country = query.country;
      if (country) {
        conditions.push({ 'position.country': country });
      }

      const departmentCode = query.departmentCode;
      const department = query.department;
      const regionCode = query.regionCode;
      const region = query.region;

      if (regionCode) {
        conditions.push({
          'position.regionCode': regionCode.toUpperCase(),
        });
      }

      if (departmentCode) {
        conditions.push({
          'position.departmentCode': departmentCode.toUpperCase(),
        });
      }

      if (region) {
        conditions.push({
          'position.slugs.region': this.slugifyLocation(region),
        });
      }

      if (department) {
        conditions.push({
          'position.slugs.department': this.slugifyLocation(department),
        });
      }

      return appendAndConditions(context, conditions);
    }

    if (query.locationMode === 'city') {
      const cityValue = query.cityValue;
      if (!cityValue) {
        return context;
      }

      if (query.cityType === 'postalCode') {
        conditions.push({ 'position.postalCode': cityValue });
        return appendAndConditions(context, conditions);
      }

      conditions.push({
        'position.slugs.city': this.slugifyLocation(cityValue),
      });
      return appendAndConditions(context, conditions);
    }

    if (query.locationMode === 'pointRadius') {
      const country = query.country;
      if (country) {
        conditions.push({
          'position.country': country.toUpperCase(),
        });
      }
      return appendAndConditions(context, conditions);
    }

    return context;
  }

  private slugifyLocation(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

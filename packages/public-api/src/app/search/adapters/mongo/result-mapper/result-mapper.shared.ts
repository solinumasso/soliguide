import {
  type SearchAudience,
  type SearchSchedule,
} from '../../../search.types';

export const DAY_KEYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export const AUDIENCE_OTHER_STATUS_MAP: Record<
  string,
  SearchAudience['otherStatuses']
> = {
  violence: 'violence',
  addiction: 'addiction',
  disability: 'disability',
  lgbtqPlus: 'lgbt+',
  'lgbt+': 'lgbt+',
  hiv: 'hiv',
  sexWork: 'prostitution',
  prostitution: 'prostitution',
  prison: 'prison',
  student: 'student',
};

export function toIsoDateTime(value: Date | string | null | undefined): string {
  if (!value) {
    return new Date(0).toISOString();
  }

  const parsedDate = value instanceof Date ? value : new Date(value);
  if (isNaN(parsedDate.getTime())) {
    return new Date(0).toISOString();
  }

  return parsedDate.toISOString();
}

export function normalizeTime(value: number | string | undefined): string {
  if (value === undefined) {
    return '00:00:00';
  }

  const digits = String(value).replace(/\D/g, '');
  const normalized = digits.padStart(4, '0').slice(-4);
  const hours = normalized.slice(0, 2);
  const minutes = normalized.slice(2, 4);

  return `${hours}:${minutes}:00`;
}

export function mapHolidayStatus(
  value: string | undefined,
): SearchSchedule['publicHolidays']['status'] {
  switch (value) {
    case 'OPEN':
      return 'open';
    case 'CLOSE':
      return 'closed';
    default:
      return 'unknown';
  }
}

export function firstMatchingValue<T extends string>(
  values: Array<string | undefined> | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  if (!values || values.length === 0) {
    return fallback;
  }

  for (const value of values) {
    if (value && allowed.includes(value as T)) {
      return value as T;
    }
  }

  return fallback;
}

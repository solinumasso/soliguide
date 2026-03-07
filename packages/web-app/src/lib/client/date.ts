import type { DaysRange, HoursRange } from '$lib/models/types';
import type { TFunction } from 'i18next';

/**
 * Format a date like '9 septembre 2024'
 */
const formatToDateWithFullMonth = (date: string, locale: string): string => {
  return new Date(date).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Converts hours from "xxxx" to a Date object format
 */
const formatStringHoursToDate = (hour: string): Date => {
  const hours = parseInt(hour.slice(-4, -2), 10);
  const minutes = parseInt(hour.slice(-2), 10);

  return new Date(new Date().setHours(hours, minutes));
};

/**
 * Format the hours to display
 */
const formatOpeningHours = (time: string, locale: string): string => {
  const timeAsDateObject = formatStringHoursToDate(time);
  const hours = timeAsDateObject.getHours();
  const minutes = timeAsDateObject.getMinutes();

  // French specific format
  if (locale.startsWith('fr')) {
    return minutes > 0 ? `${hours}h${minutes.toString().padStart(2, '0')}` : `${hours}h`;
  }

  const formatter = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    ...(timeAsDateObject.getMinutes() ? { minute: '2-digit' } : {})
  });
  return formatter.format(timeAsDateObject);
};

const formatTimeRangeToLocale = (range: HoursRange[], locale = 'fr'): HoursRange[] => {
  return range.map((hour) => {
    return {
      start: formatOpeningHours(hour.start, locale),
      end: formatOpeningHours(hour.end, locale)
    };
  });
};

const formatDateRangeToLocale = (range: DaysRange, locale = 'fr'): DaysRange => {
  const { start, end } = range;

  return {
    start: new Date(start).toLocaleDateString(locale, { timeZone: 'UTC' }),
    ...(end && { end: new Date(end).toLocaleDateString(locale, { timeZone: 'UTC' }) })
  };
};

const formatDateToLocale = (date: Date, locale = 'fr'): string => {
  return new Date(date).toLocaleDateString(locale, { timeZone: 'UTC' });
};

const convertHoursToDisplay = (hours: HoursRange[], translator: TFunction): string => {
  return formatTimeRangeToLocale(hours)
    .map((range) => `${translator('OPENING_RANGE', { start: range.start, end: range.end })}`)
    .join(' - ');
};

export {
  formatTimeRangeToLocale,
  formatDateRangeToLocale,
  formatDateToLocale,
  formatToDateWithFullMonth,
  convertHoursToDisplay
};

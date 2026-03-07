import { describe, it, expect } from 'vitest';
import { formatTimeRangeToLocale, formatDateRangeToLocale } from './date';

describe('formatTimeRangeToLocale', () => {
  it("should format start and end time in 'fr' locale", () => {
    const range = [{ start: '1200', end: '1300' }];
    const result = formatTimeRangeToLocale(range, 'fr');

    expect(result).toEqual([{ start: '12h', end: '13h' }]);
  });

  it("should format start and end time in 'en' locale with AM/PM", () => {
    const range = [{ start: '0900', end: '1730' }];
    const result = formatTimeRangeToLocale(range, 'en');

    expect(result).toEqual([{ start: '9 AM', end: '5:30 PM' }]);
  });

  it('should handle multiple time ranges', () => {
    const range = [
      { start: '012000', end: '2200' },
      { start: '1300', end: '1700' }
    ];
    const result = formatTimeRangeToLocale(range, 'fr');

    expect(result).toEqual([
      { start: '20h', end: '22h' },
      { start: '13h', end: '17h' }
    ]);
  });
});

it('should handle multiple time ranges', () => {
  const range = [
    { start: '800', end: '1200' },
    { start: '1300', end: '1700' }
  ];
  const result = formatTimeRangeToLocale(range, 'fr');

  expect(result).toEqual([
    { start: '8h', end: '12h' },
    { start: '13h', end: '17h' }
  ]);
});

describe('formatDateRangeToLocale', () => {
  it("should format dates in 'fr' locale", () => {
    const range = {
      start: '2024-10-15T00:00:00.000Z',
      end: '2024-12-25T00:00:00.000Z'
    };
    const result = formatDateRangeToLocale(range, 'fr');

    expect(result).toEqual({
      start: '15/10/2024',
      end: '25/12/2024'
    });
  });

  it("should format dates in 'en' locale", () => {
    const range = {
      start: '2024-10-15T00:00:00.000Z',
      end: '2024-12-25T00:00:00.000Z'
    };
    const result = formatDateRangeToLocale(range, 'en');

    expect(result).toEqual({
      start: '10/15/2024',
      end: '12/25/2024'
    });
  });
});

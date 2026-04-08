import { type SearchSchedule } from '../../../search.types';
import { type MongoOpeningHours } from '../place.mongo';
import {
  DAY_KEYS,
  mapHolidayStatus,
  normalizeTime,
} from './result-mapper.shared';

export class ScheduleSearchResultMapper {
  map(hours?: MongoOpeningHours): SearchSchedule {
    const weeklySchedule = DAY_KEYS.map((dayKey) => {
      const day = hours?.[dayKey];
      const slots = Array.isArray(day?.timeslot)
        ? day.timeslot
            .filter(
              (timeSlot) =>
                timeSlot?.start !== undefined && timeSlot?.end !== undefined,
            )
            .map((timeSlot) => ({
              startTime: normalizeTime(timeSlot.start),
              endTime: normalizeTime(timeSlot.end),
            }))
        : [];

      return {
        dayOfWeek: dayKey,
        status:
          slots.length > 0
            ? 'open'
            : day?.open
              ? ('open' as const)
              : ('closed' as const),
        timeSlots: slots,
      };
    });

    return {
      weeklySchedule,
      publicHolidays: {
        status: mapHolidayStatus(hours?.closedHolidays),
        openedHolidays: [],
      },
    };
  }
}

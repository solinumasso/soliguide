import {
  AnyDepartmentCode,
  getDepartmentCodeFromPostalCode,
  LocationAutoCompleteAddress,
  SoliguideCountries,
} from "../../location";
import { ApiPlace, getPosition } from "../../place";
import { PublicHoliday } from "../interfaces";

export const filterDepartmentsForHolidays = ({
  holidays,
  place,
  location,
}: {
  holidays: PublicHoliday[];
  place?: Pick<ApiPlace, "placeType" | "position" | "parcours">;
  location?: LocationAutoCompleteAddress;
}): PublicHoliday[] => {
  let departments: AnyDepartmentCode[] = [];

  if (place) {
    const position = getPosition(place);
    if (position?.postalCode) {
      departments = [
        getDepartmentCodeFromPostalCode(
          position.country as SoliguideCountries,
          position?.postalCode
        ),
      ];
    }
  } else if (location?.departmentCode) {
    departments = [location.departmentCode];
  }

  return holidays.filter((holiday) =>
    isHolidayForPostalCode(holiday, departments)
  );
};

export const isHolidayForPostalCode = (
  holiday: PublicHoliday,
  departments: AnyDepartmentCode[]
): boolean => {
  if (holiday.isNational) {
    return true;
  }

  if (!holiday.departments?.length) {
    return false;
  }

  if (!departments?.length) {
    return false;
  }

  return departments.some((departmentCode) =>
    holiday.departments.includes(departmentCode)
  );
};

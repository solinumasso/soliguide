import { UserStatus, CountryAreaTerritories, CommonUser } from "../../../users";
import { FR_DEPARTMENT_CODES } from "../../constants";
import { CountryCodes } from "../../enums";
import { getTerritoriesFromAreas } from "../getTerritoriesFromAreas";

const user = {
  status: UserStatus.ADMIN_SOLIGUIDE,
  territories: ["01", "03", "978", "984", "986", "987", "988"],
  areas: {
    fr: new CountryAreaTerritories<CountryCodes.FR>({
      departments: ["01", "03"],
    }),
  },
} as unknown as CommonUser;

describe("getTerritoriesFromAreas", () => {
  it("Return all departments for France, for ADMIN_SOLIGUIDE", () => {
    expect(getTerritoriesFromAreas(user, CountryCodes.FR)).toEqual(
      FR_DEPARTMENT_CODES
    );
  });

  it("Return all departments for France, for ADMIN_TERRITORY", () => {
    user.status = UserStatus.ADMIN_TERRITORY;
    expect(getTerritoriesFromAreas(user, CountryCodes.FR)).toEqual([
      "01",
      "03",
    ]);
  });

  it("Return empty territories array for another country", () => {
    user.status = UserStatus.PRO;
    user.areas = {
      es: new CountryAreaTerritories<CountryCodes.FR>({
        departments: ["25", "10", "03"],
      }),
    };

    expect(getTerritoriesFromAreas(user, CountryCodes.FR)).toEqual([]);
  });

  it("Return territories array for spain", () => {
    user.status = UserStatus.PRO;
    user.areas = {
      es: new CountryAreaTerritories<CountryCodes.FR>({
        departments: ["25", "10", "03"],
      }),
    };

    expect(getTerritoriesFromAreas(user, CountryCodes.ES)).toEqual([
      "25",
      "10",
      "03",
    ]);
  });
});

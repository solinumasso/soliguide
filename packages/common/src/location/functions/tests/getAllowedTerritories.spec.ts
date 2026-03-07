import { UserStatus, CountryAreaTerritories } from "../../../users";
import { FR_DEPARTMENT_CODES } from "../../constants";
import { CountryCodes } from "../../enums";
import { getAllowedTerritories } from "../getAllowedTerritories";

const user = {
  status: UserStatus.ADMIN_SOLIGUIDE,
  territories: ["01", "03", "978", "984", "986", "987", "988"],
  areas: {
    fr: new CountryAreaTerritories<CountryCodes.FR>({
      departments: ["01", "03"],
    }),
  },
};

describe("getAllowedTerritories", () => {
  it("Return all departments for France, for ADMIN_SOLIGUIDE", () => {
    expect(getAllowedTerritories(user, CountryCodes.FR)).toEqual(
      FR_DEPARTMENT_CODES
    );
  });

  it("Return all departments for France, for SOLI_BOT", () => {
    user.status = UserStatus.SOLI_BOT;
    expect(getAllowedTerritories(user, CountryCodes.FR)).toEqual(
      FR_DEPARTMENT_CODES
    );
  });

  it("Return all departments for France, for ADMIN_SOLIGUIDE", () => {
    user.status = UserStatus.ADMIN_TERRITORY;
    expect(getAllowedTerritories(user, CountryCodes.FR)).toEqual(["01", "03"]);
  });
});

import { SupportedLanguagesCode, TempInfoType } from "@soliguide/common";
import { translator } from "../../../../config";
import { parseTempInfo } from "../parse-temp-info";
import { TEMP_INFO_MOCK } from "./TEMP_INFO.mock";
import { UpComingTempInfo } from "../../../types";

describe("parseTempInfo", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2022-10-01T01:00:00.000Z"));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return a sentence with the 3 upcoming closures in english", () => {
    const upComingTempInfo: UpComingTempInfo = TEMP_INFO_MOCK.filter(
      (value) => value.placeId === 33268
    );

    const result = parseTempInfo(
      translator,
      SupportedLanguagesCode.EN,
      upComingTempInfo[0].tempInfo,
      TempInfoType.CLOSURE
    );

    expect(result).toEqual(
      "Temporary closure: from 15/06/2023 to 30/06/2023\nFirst closure for works\n\nTemporary closure: from 02/07/2023 to 11/07/2023\nSecond closure following a strike\n\nTemporary closure: from 14/07/2023 to 14/07/2023\nThird closing for July 14, public holiday"
    );
  });
});

import { PlaceType } from "@soliguide/common";

import { isValidHoursObject } from "./hours-custom.functions";

import { HOURS } from "../../mocks/HOURS.mock";

describe("isValidHoursObject", () => {
  it("doit retourner une erreur car un open n'est pas un booléen", () => {
    HOURS.monday.open = "foo" as any;

    const getIsValidHoursObjectWithWrongOpen = () => {
      isValidHoursObject(HOURS);
    };

    expect(getIsValidHoursObjectWithWrongOpen).toThrow(
      "Error: The field open is not a boolean (monday)"
    );

    HOURS.monday.open = true;
  });

  it("doit retourner une erreur car il n'y a pas de timeslot défini pour un jour de passage dans un PARCOURS_MOBILE", () => {
    const getIsValidHoursObjectWithNoTimeslot = () => {
      isValidHoursObject(HOURS, PlaceType.ITINERARY);
    };

    expect(getIsValidHoursObjectWithNoTimeslot).toThrow(
      "Error: At least one timeslot has to be set for an opening day (monday)"
    );
  });

  it("doit retourner une erreur car il y a plus de 3 crénéaux de définis dans un timeslot pour un LIEU", () => {
    HOURS.monday.timeslot = [
      { end: 800, start: 1100 },
      { end: 1300, start: 1100 },
      { end: 1500, start: 1300 },
      { end: 1800, start: 1500 },
    ];

    const getIsValidHoursObjectWithTooTimeslot = () => {
      isValidHoursObject(HOURS, PlaceType.PLACE);
    };

    expect(getIsValidHoursObjectWithTooTimeslot).toThrow(
      "Error: 3 timeslots maximum allowed in a day (monday)"
    );

    HOURS.monday.timeslot.pop();
  });

  it("doit retourner une erreur car il y a un crénéau mal défini dans un timeslot", () => {
    const getIsValidHoursObjectWithWrongTimeslot = () => {
      isValidHoursObject(HOURS);
    };

    expect(getIsValidHoursObjectWithWrongTimeslot).toThrow(
      "Error: The beginning hour of a timeslot can't be greater than the ending hour of the same timeslot (monday)"
    );

    HOURS.monday.timeslot[0] = { end: 1700, start: 1500 };
  });

  it("doit retourner une erreur car il y a un crénéau mal défini entre deux timeslots", () => {
    const getIsValidHoursObjectWithConsecutiveWrongTimeslot = () => {
      isValidHoursObject(HOURS);
    };

    expect(getIsValidHoursObjectWithConsecutiveWrongTimeslot).toThrow(
      "Error: The beginning hour of a timeslot can't be lower than the ending hour of the previous timeslot (monday)"
    );

    HOURS.monday.timeslot[0] = { end: 900, start: 800 };
  });

  it("doit retourner vrai pour un LIEU ou un PARCOURS_MOBILE quand toutes les conditions sont remplies", () => {
    expect(isValidHoursObject(HOURS, PlaceType.ITINERARY)).toBe(true);
    expect(isValidHoursObject(HOURS, PlaceType.PLACE)).toBe(true);
  });
});

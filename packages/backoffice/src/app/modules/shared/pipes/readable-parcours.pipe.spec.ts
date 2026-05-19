import { TestBed } from "@angular/core/testing";

import { ReadableParcoursPipe } from "./readable-parcours.pipe";

import { PlaceParcours } from "../../../models";

describe("ReadableParcoursPipe", () => {
  let pipe: ReadableParcoursPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ReadableParcoursPipe] });
    pipe = TestBed.inject(ReadableParcoursPipe);
  });

  it("can load instance", () => {
    expect(pipe).toBeTruthy();
  });

  it("transforms X to Y", () => {
    const value: PlaceParcours[] = [
      new PlaceParcours({
        position: {
          address: "12 rue des Fausset, 33000 Bordeaux",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      }),
      new PlaceParcours({
        position: {
          address: "1 cours de la Somme, 33800 Bordeaux",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      }),
    ];
    expect(pipe.transform(value)).toEqual(
      "1. 12 rue des Fausset, 33000 Bordeaux - 2. 1 cours de la Somme, 33800 Bordeaux"
    );
  });
});

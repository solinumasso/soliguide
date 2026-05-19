import { TestBed } from "@angular/core/testing";
import { USER_PRO_MOCK } from "../../../../../mocks/USER_PRO.mock";
import { User } from "../../users/classes";
import { UserFullNamePipe } from "./user-fullname.pipe";

describe("UserFullNamePipe", () => {
  let pipe: UserFullNamePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [UserFullNamePipe] });
    pipe = TestBed.inject(UserFullNamePipe);
  });

  it("can load instance", () => {
    expect(pipe).toBeTruthy();
  });

  it("transforms X to Y", () => {
    const value: User = new User(USER_PRO_MOCK);
    expect(pipe.transform(value)).toEqual(value.name + " " + value.lastname);
  });
});

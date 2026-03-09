import { BehaviorSubject, of } from "rxjs";
import { User } from "../src/app/modules/users/classes";

import { USER_PRO_MOCK } from "./USER_PRO.mock";

export class MockAuthService {
  public currentUserSubject: BehaviorSubject<User | null>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      new User(USER_PRO_MOCK)
    );
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public isAuth() {
    return of(true);
  }
}

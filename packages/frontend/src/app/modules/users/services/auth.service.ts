import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { User } from "../classes";

@Injectable({ providedIn: "root" })
export class AuthService {
  public readonly currentUserSubject = new BehaviorSubject<User | null>(null);

  public get currentUserValue(): User | null {
    return null;
  }

  public isAuth(): Observable<boolean> {
    return of(false);
  }

  public logoutAndRedirect(): void {}

  public notAuthorized(): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public changeCurrentOrga(index: number): Observable<null> {
    return of(null);
  }
}

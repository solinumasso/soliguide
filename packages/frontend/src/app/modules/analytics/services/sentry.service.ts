import { Injectable, OnDestroy } from "@angular/core";

import { Subscription } from "rxjs";

import { environment } from "../../../../environments/environment";
import { User } from "../../users/classes";
import { AuthService } from "../../users/services/auth.service";
import { getCurrentScope } from "@sentry/angular";

@Injectable({
  providedIn: "root",
})
export class SentryService implements OnDestroy {
  private readonly subscription: Subscription;
  public readonly enabled = environment.sentryDsn;

  public constructor(private readonly authService: AuthService) {
    this.subscription = new Subscription();
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public registerUserChange() {
    if (this.enabled) {
      this.subscription.add(
        this.authService.currentUserSubject.subscribe((user: User | null) => {
          if (user) {
            getCurrentScope().setUser({
              email: user.mail,
              isAdmin: user.admin,
              role: user.role,
              lastname: user.lastname,
              name: user.name,
            });
          } else {
            getCurrentScope().setTag("organisation", "none");
            getCurrentScope().setUser({});
          }
        })
      );
    }
  }
}

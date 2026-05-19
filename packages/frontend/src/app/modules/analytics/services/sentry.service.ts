import { Injectable, OnDestroy } from "@angular/core";

import { Subscription } from "rxjs";

import { environment } from "../../../../environments/environment";
import { getCurrentScope } from "@sentry/angular";

@Injectable({
  providedIn: "root",
})
export class SentryService implements OnDestroy {
  private readonly subscription: Subscription;
  public readonly enabled = environment.sentryDsn;

  public constructor() {
    this.subscription = new Subscription();
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public registerUserChange() {
    if (this.enabled) {
      getCurrentScope().setTag("organisation", "none");
      getCurrentScope().setUser({});
    }
  }
}

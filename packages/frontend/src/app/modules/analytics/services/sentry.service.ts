import { Injectable } from "@angular/core";

import { environment } from "../../../../environments/environment";
import { getCurrentScope } from "@sentry/angular";

@Injectable({
  providedIn: "root",
})
export class SentryService {
  public readonly enabled = environment.sentryDsn;

  public registerUserChange() {
    if (this.enabled) {
      getCurrentScope().setTag("organisation", "none");
      getCurrentScope().setUser({});
    }
  }
}

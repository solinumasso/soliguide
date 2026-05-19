import { Injectable, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import {
  PosthogService as CommonPosthogService,
  type PosthogProperties,
} from "@soliguide/common-angular";
import { CookieManagerService } from "../../shared";

@Injectable({
  providedIn: "root",
})
export class PosthogService implements OnDestroy {
  private readonly subscription: Subscription;

  private analyticsCookieConsent: boolean;
  private chatCookieConsent: boolean;
  private hasUserMadeCookieChoice: boolean;

  public constructor(
    private readonly commonPosthogService: CommonPosthogService,
    private readonly cookieManagerService: CookieManagerService
  ) {
    this.subscription = new Subscription();

    this.subscription.add(
      this.cookieManagerService.analyticsConsentSubject.subscribe(
        (consent: boolean) => {
          if (consent) {
            this.commonPosthogService.switchPersistence("localStorage+cookie");
          } else {
            this.commonPosthogService.switchPersistence("memory");
          }

          if (this.analyticsCookieConsent !== consent) {
            this.commonPosthogService.setPersonProperties({
              analytics_cookies_consent: consent ? "granted" : "denied",
            });
            this.analyticsCookieConsent = consent;
          }
        }
      )
    );

    this.subscription.add(
      this.cookieManagerService.chatConsentSubject.subscribe(
        (consent: boolean) => {
          if (this.chatCookieConsent !== consent) {
            this.commonPosthogService.setPersonProperties({
              chat_cookies_consent: consent ? "granted" : "denied",
            });
            this.chatCookieConsent = consent;
          }
        }
      )
    );

    this.subscription.add(
      this.cookieManagerService.hasUserMadeCookieChoice.subscribe(
        (hasMadeChoice: boolean) => {
          if (this.hasUserMadeCookieChoice !== hasMadeChoice) {
            this.commonPosthogService.setPersonProperties({
              has_made_cookie_choice: hasMadeChoice ? "yes" : "no",
            });
            this.hasUserMadeCookieChoice = hasMadeChoice;
          }
        }
      )
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public capture(eventName: string, properties?: PosthogProperties): void {
    this.commonPosthogService.capture(`frontend-${eventName}`, properties);
  }
}

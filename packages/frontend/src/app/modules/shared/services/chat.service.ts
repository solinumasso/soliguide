import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";

import { CookieManagerService } from "./cookie-manager.service";
import { globalConstants } from "../../../shared/functions";
import { THEME_CONFIGURATION } from "../../../models";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private chatHasBeenSetup = false;
  private readonly subscription: Subscription;
  public chatButtonClicked = false;
  public readonly isChatEnabled = Boolean(THEME_CONFIGURATION.chatWebsiteId);

  constructor(private readonly cookieManagerService: CookieManagerService) {
    this.subscription = new Subscription();

    this.subscription.add(
      this.cookieManagerService.chatConsentSubject.subscribe(
        (consent: boolean) => {
          if (consent) {
            this.setupChat();
          } else {
            for (const item of globalConstants.listItems()) {
              if (item.startsWith("ZD")) {
                globalConstants.removeItem(item);
              }
            }
            this.resetSession();
          }
        }
      )
    );
  }

  public hasUserGivenConsent(): boolean {
    if (this.cookieManagerService.chatConsentSubject.value) {
      return true;
    }

    this.cookieManagerService.openCookiesConsentModal();

    return false;
  }

  // Delete chat session cookie and refresh page
  // skipcq: JS-0105
  public resetSession(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const zE = (window as any).zE as any; // skipcq: JS-0323

    if (!zE) {
      return;
    }

    zE("messenger", "hide");
    zE("messenger:set", "cookies", false);
    zE("messenger", "logoutUser");

    this.chatHasBeenSetup = false;
  }

  public setupChat = async (): Promise<void> => {
    if (!this.hasUserGivenConsent()) {
      return;
    }

    this.chatHasBeenSetup = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let zE = (window as any).zE as any; // skipcq: JS-0323
    let counter = 0;

    while (!zE && counter < 3) {
      await new Promise((f) => setTimeout(f, 1000));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      zE = (window as any).zE as any; // skipcq: JS-0323
      counter++;
    }

    if (!zE) {
      this.chatHasBeenSetup = false;
      return;
    }

    zE("messenger:set", "cookies", true);
    zE("messenger", "show");
  };

  public async openChat(): Promise<void> {
    if (!this.chatHasBeenSetup) {
      this.setupChat();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let zE = (window as any).zE as any; // skipcq: JS-0323
    let counter = 0;

    while (!zE && counter < 3) {
      await new Promise((f) => setTimeout(f, 1000));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      zE = (window as any).zE as any; // skipcq: JS-0323
      counter++;
    }

    if (!zE) {
      return;
    }

    zE("messenger", "open");
  }

  public async openChatAfterPreferences(): Promise<void> {
    if (this.cookieManagerService.chatConsentSubject.value) {
      this.openChat();
    }
  }
}

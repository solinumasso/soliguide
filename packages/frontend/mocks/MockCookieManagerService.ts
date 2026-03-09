import { BehaviorSubject } from "rxjs";

global.window = {
  silktideCookieBannerManager: {
    // skipcq JS-0321
    toggleModal: () => {},
  },
} as unknown as Window & typeof globalThis;

export class MockCookieManagerService {
  public analyticsConsentSubject: BehaviorSubject<boolean>;
  public chatConsentSubject: BehaviorSubject<boolean>;

  constructor() {
    this.analyticsConsentSubject = new BehaviorSubject<boolean>(false);
    this.chatConsentSubject = new BehaviorSubject<boolean>(false);
  }

  // skipcq: JS-0105, JS-0321
  public openCookiesConsentModal(): void {}
}

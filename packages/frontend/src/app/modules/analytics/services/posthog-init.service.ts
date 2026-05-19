import { Injectable, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { PosthogService } from "@soliguide/common-angular";
import { CurrentLanguageService } from "../../general/services/current-language.service";

@Injectable({
  providedIn: "root",
})
export class PosthogInitService implements OnDestroy {
  private readonly subscription: Subscription;

  public constructor(
    private readonly posthogService: PosthogService,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    this.subscription = new Subscription();
  }

  public init(): void {
    this.subscribeToCurrentLanguageSubject();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private subscribeToCurrentLanguageSubject(): void {
    if (this.posthogService.enabled) {
      this.posthogService.setProcessProperties((properties) => {
        return {
          ...properties,
          currentLanguage: this.currentLanguageService.currentLanguage,
        };
      });
    }
  }
}

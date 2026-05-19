import { Injectable } from "@angular/core";
import { PosthogService } from "@soliguide/common-angular";
import { CurrentLanguageService } from "../../general/services/current-language.service";

@Injectable({
  providedIn: "root",
})
export class PosthogInitService {
  public constructor(
    private readonly posthogService: PosthogService,
    private readonly currentLanguageService: CurrentLanguageService
  ) {}

  public init(): void {
    this.subscribeToCurrentLanguageSubject();
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

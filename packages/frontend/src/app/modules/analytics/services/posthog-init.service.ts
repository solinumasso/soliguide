import { Injectable, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { PosthogService } from "@soliguide/common-angular";
import { CurrentLanguageService } from "../../general/services/current-language.service";
import { AuthService } from "../../users/services/auth.service";
import { User } from "../../users/classes";

@Injectable({
  providedIn: "root",
})
export class PosthogInitService implements OnDestroy {
  private readonly subscription: Subscription;

  public constructor(
    private readonly posthogService: PosthogService,
    private readonly authService: AuthService,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    this.subscription = new Subscription();
  }

  public init(): void {
    this.subscribeToCurrentLanguageSubject();
    this.subscribeToCurrentUserSubject();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private subscribeToCurrentLanguageSubject(): void {
    if (this.posthogService.enabled) {
      // I couldn't get the register method to work properly
      this.posthogService.setProcessProperties((properties) => {
        return {
          ...properties,
          currentLanguage: this.currentLanguageService.currentLanguage,
        };
      });
    }
  }

  private subscribeToCurrentUserSubject(): void {
    if (this.posthogService.canBeEnabled) {
      this.subscription.add(
        this.authService.currentUserSubject.subscribe((user: User | null) => {
          if (user) {
            this.identify(user);
          } else {
            this.reset();
          }
        })
      );
    }
  }

  private identify(user: User): void {
    if (this.posthogService.enabled && user.user_id) {
      const currentOrganization =
        typeof user.currentOrga?.organization_id === "number"
          ? user.currentOrga.organization_id
          : null;

      const organizations = user.organizations
        ? user.organizations
            .filter(
              (organization) => typeof organization.organization_id === "number"
            )
            .map((organization) => organization.organization_id)
        : [];

      const currentLanguage = this.currentLanguageService.currentLanguage;

      this.posthogService.identify(`${user.user_id}`, {
        territories: user.territories,
        languages: user.languages,
        status: user.status,
        role: user.role,
        currentOrganization,
        organizations,
        currentLanguage,
      });

      this.subscription.add(
        this.posthogService.posthogInstance.subscribe((posthogInstance) => {
          if (currentOrganization) {
            posthogInstance.group("organization", `${currentOrganization}`);
          }
        })
      );
    }
  }

  private reset(): void {
    if (this.posthogService.enabled) {
      this.subscription.add(
        this.posthogService.posthogInstance.subscribe((posthogInstance) =>
          posthogInstance.reset()
        )
      );
    }
  }
}

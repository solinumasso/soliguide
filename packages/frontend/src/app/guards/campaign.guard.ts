import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { catchError, map, Observable, of } from "rxjs";

import { CampaignService } from "../modules/campaign/services/campaign.service";

import { AuthService } from "../modules/users/services/auth.service";

@Injectable({ providedIn: "root" })
export class CampaignGuard {
  constructor(
    private authService: AuthService,
    private campaignService: CampaignService,
    private route: ActivatedRoute
  ) {}

  public canActivate(): Observable<boolean> {
    if (this.route.snapshot.params.lieu_id) {
      return this.campaignService
        .getIfCampaignAccessible("place", this.route.snapshot.params.lieu_id)
        .pipe(
          map((hasAccess: boolean) => {
            if (hasAccess) {
              return true;
            }

            this.authService.notAuthorized();
            return false;
          }),
          catchError(() => {
            this.authService.notAuthorized();
            return of(false);
          })
        );
    } else if (this.route.snapshot.params.organization_id) {
      return this.campaignService
        .getIfCampaignAccessible(
          "orga",
          this.route.snapshot.params.organization_id
        )
        .pipe(
          map((hasAccess: boolean) => {
            if (hasAccess) {
              return true;
            }

            this.authService.notAuthorized();
            return false;
          }),
          catchError(() => {
            this.authService.notAuthorized();
            return of(false);
          })
        );
    } else {
      const user_id = this.authService.currentUserValue.user_id;
      return this.campaignService.getIfCampaignAccessible("user", user_id).pipe(
        map((hasAccess: boolean) => {
          if (hasAccess) {
            return true;
          }

          this.authService.notAuthorized();
          return false;
        }),
        catchError(() => {
          this.authService.notAuthorized();
          return of(false);
        })
      );
    }
  }
}

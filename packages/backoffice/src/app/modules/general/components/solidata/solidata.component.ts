import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { THEME_CONFIGURATION } from "../../../../models";
import { AuthService } from "src/app/modules/users/services/auth.service";
import { CurrentLanguageService } from "../../services/current-language.service";
import { SOLIDATA_DASHBOARD_REDIRECTIONS } from "src/app/shared";

@Component({
  selector: "app-solidata",
  templateUrl: "./solidata.component.html",
  styleUrls: ["./solidata.component.css"],
})
export class SolidataComponent implements OnInit {
  public iframeUrl?: SafeResourceUrl;
  public routePrefix: string;

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const superset = params.get("superset");

      this.authService.isAuth().subscribe((isAuthenticated) => {
        if (!superset) return;

        if (isAuthenticated && SOLIDATA_DASHBOARD_REDIRECTIONS[superset]) {
          this.router.navigate([
            this.routePrefix,
            ...SOLIDATA_DASHBOARD_REDIRECTIONS[superset],
          ]);
          return;
        }

        const supersetData = Object.values(
          THEME_CONFIGURATION.solidata || {}
        ).find((data) => data.seoUrl === superset);

        if (supersetData?.dashboardUrl) {
          this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            supersetData.dashboardUrl
          );
        }
      });
    });
  }
}

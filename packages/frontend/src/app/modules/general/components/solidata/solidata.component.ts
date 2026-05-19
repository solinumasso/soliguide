import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { THEME_CONFIGURATION } from "../../../../models";
import { CurrentLanguageService } from "../../services/current-language.service";

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
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const superset = params.get("superset");
      if (!superset) return;

      const supersetData = Object.values(
        THEME_CONFIGURATION.solidata || {}
      ).find((data) => data.seoUrl === superset);

      if (supersetData?.dashboardUrl) {
        this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          supersetData.dashboardUrl
        );
      }
    });
  }
}

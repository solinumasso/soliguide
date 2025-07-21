/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { THEME_CONFIGURATION } from "../../../../models";
import { AuthService } from "src/app/modules/users/services/auth.service";
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
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  ngOnInit() {
    const superset = this.route.snapshot.paramMap.get("superset");

    this.authService.isAuth().subscribe((isAuthenticated) => {
      if (isAuthenticated && superset === "demo_acces_alimentation") {
        this.router.navigate([
          this.routePrefix,
          "solidata",
          "access_alimentation",
        ]);
        return;
      }

      const supersetData = Object.values(
        THEME_CONFIGURATION.solidata || {}
      ).find((data) => data.seoUrl === superset);

      this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        supersetData.dashboardUrl
      );
    });
  }
}

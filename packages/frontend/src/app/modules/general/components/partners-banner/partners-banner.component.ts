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
import { CountryCodes, Themes } from "@soliguide/common";
import { themeService } from "../../../../shared/services/theme.service";
import { LogoWithLink } from "../../../../shared/constants";
import {
  getLogosForCountry,
  getFunderNamesForCountry,
} from "src/app/shared/functions/getLogosForCountry";

@Component({
  selector: "app-partners-banner",
  templateUrl: "./partners-banner.component.html",
  styleUrls: ["./partners-banner.component.css"],
})
export class PartnersBannerComponent implements OnInit {
  public logos: LogoWithLink[] = [];
  private currentCountry!: CountryCodes;

  ngOnInit(): void {
    this.currentCountry = this.getCountryFromTheme(themeService.getTheme());
    this.logos = getLogosForCountry(this.currentCountry);
  }

  getFunderLogos(): LogoWithLink[] {
    const funderNames = getFunderNamesForCountry(this.currentCountry);
    return this.logos.filter((logo) => funderNames.includes(logo.alt));
  }

  getDeployerLogos(): LogoWithLink[] {
    const funderNames = getFunderNamesForCountry(this.currentCountry);
    return this.logos.filter((logo) => !funderNames.includes(logo.alt));
  }

  // eslint-disable-next-line class-methods-use-this
  private getCountryFromTheme(theme: Themes): CountryCodes {
    const countryCode = theme.split("_").pop();
    if (
      countryCode &&
      Object.values(CountryCodes).includes(countryCode as CountryCodes)
    ) {
      return countryCode as CountryCodes;
    }
    return CountryCodes.FR; // fallback
  }
}

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
import { ALL_LOGOS, FUNDERS, LogoWithLink } from "../../../../shared/constants";

@Component({
  selector: "app-partners-banner",
  templateUrl: "./partners-banner.component.html",
  styleUrls: ["./partners-banner.component.css"],
})
export class PartnersBannerComponent implements OnInit {
  public deployerLogos: LogoWithLink[] = [];
  public funderLogos: LogoWithLink[] = [];

  private readonly funderSet = FUNDERS;

  ngOnInit(): void {
    this.initializeLogos();
  }

  private initializeLogos(): void {
    const [funders, deployers] = this.partitionLogosByFunderStatus(ALL_LOGOS);
    this.funderLogos = funders;
    this.deployerLogos = deployers;
  }

  private partitionLogosByFunderStatus(
    logos: LogoWithLink[]
  ): [LogoWithLink[], LogoWithLink[]] {
    const funders: LogoWithLink[] = [];
    const deployers: LogoWithLink[] = [];

    logos.forEach((logo) => {
      this.funderSet.has(logo.alt) ? funders.push(logo) : deployers.push(logo);
    });

    return [funders, deployers];
  }
}

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
import { Component, Input, OnInit } from "@angular/core";
import { SupportedLanguagesCode } from "@soliguide/common";
import { WidgetPlace } from "../../../../models";
import { fadeInOut } from "../../../../shared";

import { environment } from "../../../../../environments/environment";
import { PosthogService } from "../../../analytics/services/posthog.service";

@Component({
  animations: [fadeInOut],
  selector: "app-single-result",
  templateUrl: "./single-result.component.html",
  styleUrls: ["./single-result.component.scss"],
})
export class SingleResultComponent implements OnInit {
  @Input() public place!: WidgetPlace;
  @Input() public currentLang: SupportedLanguagesCode;
  @Input() public disabled: boolean;

  public soliguideLink = "";
  public osmLink = "";

  constructor(private readonly posthogService: PosthogService) {
    this.currentLang = SupportedLanguagesCode.FR;
    this.disabled = false;
  }

  public ngOnInit(): void {
    this.soliguideLink = `${environment.frontendUrl}/${this.currentLang}/fiche/${this.place.seo_url}`;
    this.osmLink =
      "https://www.openstreetmap.org/search?query=" +
      this.place.position.address;
  }

  public recordClick = async (eventName: string) => {
    await this.posthogService.capture(eventName, {
      place: this.place,
      currentLang: this.currentLang,
    });
  };
}

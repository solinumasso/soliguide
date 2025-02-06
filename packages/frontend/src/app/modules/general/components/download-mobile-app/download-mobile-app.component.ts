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
import { format } from "date-fns";

import {
  IS_BOT,
  IS_WEBVIEW_APP,
  globalConstants,
  getMobileAppLink,
} from "../../../../shared";
import { THEME_CONFIGURATION } from "../../../../models";

@Component({
  selector: "app-download-mobile-app",
  templateUrl: "./download-mobile-app.component.html",
  styleUrls: ["./download-mobile-app.component.css"],
})
export class DownloadMobileAppComponent implements OnInit {
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  public readonly IS_WEBVIEW_APP = IS_WEBVIEW_APP;
  public readonly IS_BOT = IS_BOT;

  public mobileLink: string | null = null;

  ngOnInit(): void {
    const lastTimeDownloadProposed = globalConstants.getItem("APP_SUGGESTION");
    const today = format(new Date(), "dd/MM/yyyy");

    if (lastTimeDownloadProposed !== today) {
      this.mobileLink = getMobileAppLink();
    } else {
      this.mobileLink = null;
    }
  }

  public closeApp(): void {
    const today = format(new Date(), "dd/MM/yyyy");
    globalConstants.setItem("APP_SUGGESTION", today);
    this.mobileLink = null;
  }
}

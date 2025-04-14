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
import { Component, OnInit, Input } from "@angular/core";

import {
  I18nTranslator,
  Publics,
  translatePublics,
  WelcomedPublics,
} from "@soliguide/common";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { NgxTranslateI18nextAdapter } from "../../../shared/services/ngx-translate-i18next-adaptater.service";

@Component({
  selector: "app-display-publics-admin",
  templateUrl: "./display-public-admin.component.html",
  styleUrls: ["./display-public-admin.component.css"],
})
export class DisplayPublicAdminComponent implements OnInit {
  @Input() public publics!: Publics;
  @Input() public languages!: string[];

  public publicsText: string = "";

  public readonly WelcomedPublics = WelcomedPublics;

  constructor(
    private readonly adaptater: NgxTranslateI18nextAdapter,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    this.publicsText = "";
  }

  public ngOnInit(): void {
    this.publicsText = translatePublics(
      this.adaptater as unknown as I18nTranslator,
      this.currentLanguageService.currentLanguage,
      this.publics,
      true,
      false
    );
  }
}

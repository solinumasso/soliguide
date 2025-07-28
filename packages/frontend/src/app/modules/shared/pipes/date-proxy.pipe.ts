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
import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SupportedLanguagesCode } from "@soliguide/common";

@Pipe({
  name: "dateProxy",
})
export class DateProxyPipe implements PipeTransform {
  constructor(private readonly translateService: TranslateService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public transform(value: any, pattern: string = "shortDate"): string {
    const ngPipe = new DatePipe(
      this.translateService?.currentLang ?? SupportedLanguagesCode.FR
    );
    return ngPipe.transform(value, pattern);
  }
}

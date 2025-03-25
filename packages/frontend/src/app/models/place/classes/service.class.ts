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
import {
  CommonNewPlaceService,
  getCategoriesSpecificFields,
} from "@soliguide/common";
import { BasePlaceTempInfos } from "./temp-infos";
import { OpeningHours } from "./opening-hours.class";
import { THEME_CONFIGURATION } from "../../themes";

export class Service extends CommonNewPlaceService {
  public hasSpecialName: boolean;
  public show: boolean;
  public override close: BasePlaceTempInfos = new BasePlaceTempInfos();

  public showHoraires: boolean;
  public showPublics: boolean;
  public showModalities: boolean;
  public override hours: OpeningHours = new OpeningHours();

  constructor(
    service?: Partial<Service | CommonNewPlaceService>,
    isInForm = false
  ) {
    super(service, isInForm);

    this.hasSpecialName = this.category
      ? this.category in
        getCategoriesSpecificFields(THEME_CONFIGURATION.country)
      : false;

    if (service) {
      this.hours = new OpeningHours(service?.hours, isInForm);
      this.close = new BasePlaceTempInfos(
        {
          serviceObjectId: this.serviceObjectId,
          ...service.close,
        },
        isInForm
      );
    } else {
      this.close = new BasePlaceTempInfos(
        { serviceObjectId: "NEW_SERVICE_OBJECT_ID" },
        isInForm
      );
      this.hours = new OpeningHours(null, isInForm);
    }
    this.showHoraires = false;
    this.showPublics = false;
    this.showModalities = false;

    this.show = false;
    if (typeof (service as Service)?.show === "boolean") {
      this.show = (service as Service).show;
    }
  }
}

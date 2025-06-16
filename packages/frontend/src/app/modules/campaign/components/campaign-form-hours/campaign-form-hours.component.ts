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
import { AfterViewInit, Component } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

import {
  TempInfoType,
  BasePlaceTempInfo,
  OpeningHours,
} from "@soliguide/common";

import { ToastrService } from "ngx-toastr";

import { CampaignService } from "../../services/campaign.service";

import { ParentTempInfosFormComponent } from "../../../form-place/components/temp-infos-forms/parent-temp-infos-form/parent-temp-infos-form.component";
import { AdminTempInfosService } from "../../../form-place/services/admin-temp-infos.service";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { PosthogService } from "../../../analytics/services/posthog.service";
import { TranslateService } from "@ngx-translate/core";
import { Place } from "../../../../models/place/classes";

@Component({
  selector: "app-campaign-form-hours",
  templateUrl: "./campaign-form-hours.component.html",
  styleUrls: ["./campaign-form-hours.component.css"],
})
export class CampaignFormHoursComponent
  extends ParentTempInfosFormComponent
  implements AfterViewInit
{
  public horairesTempForm!: UntypedFormGroup;
  public tempHours: BasePlaceTempInfo;

  constructor(
    protected override readonly adminTempInfosService: AdminTempInfosService,
    protected override readonly campaignService: CampaignService,
    protected override readonly formBuilder: UntypedFormBuilder,
    protected override readonly route: ActivatedRoute,
    protected override readonly router: Router,
    protected override readonly titleService: Title,
    protected override readonly toastr: ToastrService,
    protected override readonly currentLanguageService: CurrentLanguageService,
    protected override readonly posthogService: PosthogService,
    protected override readonly translateService: TranslateService
  ) {
    super(
      adminTempInfosService,
      campaignService,
      formBuilder,
      route,
      router,
      titleService,
      toastr,
      currentLanguageService,
      posthogService,
      translateService
    );

    this.noChanges = null;
    this.place = new Place();
    this.loading = false;
    this.submitted = false;

    this.tempInfoType = TempInfoType.HOURS;
    this.tempHours = new BasePlaceTempInfo();
    this.actualHours = new OpeningHours();
    this.isCampaign = true;
  }

  public ngAfterViewInit(): void {
    this.tempHours = new BasePlaceTempInfo();

    this.actualHours = this.place.newhours;

    if (this.place.campaigns.runningCampaign.sections.hours.date) {
      this.noChanges =
        !this.place.campaigns.runningCampaign.sections.hours.changes;
      this.tempHours = this.place.tempInfos.hours;
    }
  }
}

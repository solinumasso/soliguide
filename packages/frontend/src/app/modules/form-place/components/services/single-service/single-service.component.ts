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
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SecurityContext,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { CK_EDITOR_CONF, regexp } from "../../../../../shared";
import { Service } from "../../../../../models";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-form-single-service-fiche",
  templateUrl: "./single-service.component.html",
  styleUrls: ["./single-service.component.css"],
})
export class FormSingleServiceFicheComponent implements OnInit {
  @Input() public service: Service;

  @Input() public serviceIndex: number;
  @Input() public placeId: number;

  @Input() public canBeDeleted: boolean;
  @Input() public closeOption: boolean;
  @Input() public differentHoursOption: boolean;
  @Input() public differentModalitiesOption: boolean;
  @Input() public differentPublicsOption: boolean;
  @Input() public saturationOption: boolean;

  @Input() public typeError: string[];

  @Input() public submitted: boolean;

  public editor = ClassicEditor;
  public editorConfig = CK_EDITOR_CONF;

  public isDescriptionValid: boolean;

  @Output() public readonly deletedServiceIndex = new EventEmitter<number>();
  @Output() public readonly showServiceIndex = new EventEmitter<number>();
  @Output() public readonly descriptionHasError = new EventEmitter<boolean>();

  constructor(
    private _sanitizer: DomSanitizer,
    private readonly translateService: TranslateService
  ) {
    this.editorConfig.placeholder =
      this.translateService.instant("ENTER_TEXT_HERE");
    this.isDescriptionValid = true;
  }

  public ngOnInit(): void {
    this.service.description = this._sanitizer.sanitize(
      SecurityContext.HTML,
      this.service.description
    );
    this.checkValue(this.service.description);
  }

  public toggleShow(): void {
    if (this.service.show) {
      this.service.show = false;
    } else {
      this.showServiceIndex.emit(this.serviceIndex);
    }
  }

  public deleteService(): void {
    if (this.canBeDeleted) {
      this.deletedServiceIndex.emit(this.serviceIndex);
    }
  }

  public checkValue(event: string): void {
    if (event) {
      const description = event.replace(regexp.htmlTag, "").trim();

      if (description.length > 4000) {
        this.isDescriptionValid = false;
        this.descriptionHasError.emit(true);
      } else {
        this.isDescriptionValid = true;
        this.descriptionHasError.emit(false);
      }
    }
  }
}

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
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from "@angular/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import {
  CommonPlaceDocument,
  Modalities,
  Publics,
  OpeningHours,
} from "@soliguide/common";
import { ToastrService } from "ngx-toastr";
import { UploadService } from "../../services/upload.service";
import { Service } from "../../../../models/place/classes";
import cloneDeep from "lodash.clonedeep";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-form-services-fiche",
  templateUrl: "./services.component.html",
  styleUrls: ["./services.component.css"],
})
export class FormServicesFicheComponent {
  @Input() public placeId!: number;
  @Input() public services!: Service[];

  @Input() public lastHours!: OpeningHours;
  @Input() public lastModalities!: Modalities;
  @Input() public lastPublics!: Publics;

  @Input() public closeOption!: boolean;
  @Input() public differentHoursOption!: boolean;
  @Input() public differentModalitiesOption!: boolean;
  @Input() public differentPublicsOption!: boolean;
  @Input() public saturationOption!: boolean;

  @Input() public submitted!: boolean;

  @Input() public typeError!: string[];

  @Input() public servicesWithoutCategory!: number[];

  @Output() public readonly isDescriptionInvalid = new EventEmitter<boolean>();

  @ContentChild("formTableHorairesTemplate", { static: false })
  public formTableHorairesTemplateRef!: TemplateRef<HTMLElement>;

  @ContentChild("formModalitiesTemplate", { static: false })
  public formModalitiesTemplateRef!: TemplateRef<HTMLElement>;

  constructor(
    private readonly toastr: ToastrService,
    private readonly uploadService: UploadService,
    private readonly translateService: TranslateService
  ) {
    this.services = [];
  }

  public newService(): void {
    this.services.forEach((service: Service, i: number) => {
      this.services[i] = {
        ...service,
        show: false,
      };
    });

    const lastIndex = this.services.length - 1;
    const serviceTmp = new Service(null, true);

    serviceTmp.hours = this.lastHours
      ? cloneDeep(this.lastHours)
      : cloneDeep(this.services[lastIndex].hours);

    serviceTmp.modalities = this.lastModalities
      ? cloneDeep(this.lastModalities)
      : cloneDeep(this.services[lastIndex].modalities);
    serviceTmp.modalities.docs = [];

    serviceTmp.publics = this.lastPublics
      ? cloneDeep(this.lastPublics)
      : cloneDeep(this.services[lastIndex].publics);

    this.services.push(serviceTmp);
    this.services[lastIndex + 1].show = true;
  }

  public deleteService(index: number): void {
    if (this.services.length === 1) {
      this.toastr.error(
        this.translateService.instant("CANNOT_HAVE_NO_SERVICES")
      );
      return;
    }

    if (this.services[index].modalities.docs?.length) {
      this.services[index].modalities.docs.forEach(
        (doc: CommonPlaceDocument, i: number) => {
          this.uploadService
            .delete(doc._id, this.placeId, "documents", index)
            .subscribe(() => {
              this.services[index].modalities.docs.splice(i, 1);
              this.services.splice(index, 1);
            });
        }
      );
    } else {
      this.services.splice(index, 1);
    }
  }

  public showService(index: number): void {
    this.services.forEach((service: Service, i: number) => {
      this.services[i] = {
        ...service,
        show: i === index,
      };
    });
  }

  public handleDescriptionError(hasError: boolean): void {
    this.isDescriptionInvalid.emit(hasError);
  }

  // TODO: créer une directive regroupant les méthodes liées aux éléments que l'on peut drag and drop dans les formulaires (celui-ci et ceux des services dans les places pour le moment)
  public onDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.services, event.previousIndex, event.currentIndex);
  }
}

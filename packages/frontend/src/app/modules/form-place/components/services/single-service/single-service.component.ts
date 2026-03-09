import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SecurityContext,
  SimpleChanges,
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
export class FormSingleServiceFicheComponent implements OnInit, OnChanges {
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

  @Input() public servicesWithoutCategory: number[] = [];

  public hasErrorCategory: boolean = false;

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
    this.updateErrorCategory();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes["servicesWithoutCategory"]) {
      this.updateErrorCategory();
    }
  }

  private updateErrorCategory(): void {
    this.hasErrorCategory = this.servicesWithoutCategory.includes(
      this.serviceIndex + 1
    );
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

import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import {
  SUPPORTED_LANGUAGES,
  ALL_SUPPORTED_LANGUAGES_NAME,
  EXPORT_COLUMNS,
  EXPORT_EXTENSIONS,
  ExportFileType,
  ExportParams,
  SortingFilters,
} from "@soliguide/common";

import { saveAs } from "file-saver";

import { ToastrService } from "ngx-toastr";

import { AdminSearchPlaces } from "../../classes";

import { ManagePlacesService } from "../../services/manage-places.service";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { TranslateService } from "@ngx-translate/core";
import { THEME_CONFIGURATION } from "../../../../models";
@Component({
  selector: "app-auto-export-place",
  templateUrl: "./auto-export-place.component.html",
  styleUrls: ["./auto-export-place.component.css"],
})
export class AutoExportPlaceComponent {
  @Input() public search: AdminSearchPlaces;

  @Output() public readonly autoloading = new EventEmitter<boolean>();

  @ViewChild("autoexportform") public exportForm: NgForm;

  public exporting: boolean;

  public fileRequestParameters: ExportParams;

  public readonly OPTIONS_EXPORT = Object.keys(EXPORT_COLUMNS);
  public readonly EXPORT_COLUMNS = EXPORT_COLUMNS;
  public readonly SUPPORTED_LANGUAGES = SUPPORTED_LANGUAGES;
  public readonly ALL_SUPPORTED_LANGUAGES_NAME = ALL_SUPPORTED_LANGUAGES_NAME;
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;

  constructor(
    private readonly managePlacesService: ManagePlacesService,
    private readonly modalService: NgbModal,
    private readonly toastr: ToastrService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {
    this.fileRequestParameters = {
      fileType: ExportFileType.CSV,
      sortingFilter: SortingFilters.CITY,
      language: this.currentLanguageService.currentLanguage,
      showUpcomingTempInfo: true,
      infos: {
        address: true,
        city: true,
        email: true,
        hours: true,
        latitude: true,
        lieu_id: true,
        linkToSoliguide: true,
        longitude: true,
        modalities: true,
        name: true,
        phoneNumbers: true,
        postalCode: true,
        publics: true,
        services: true,
        tempClosure: true,
        tempHours: true,
        tempMessage: true,
        updatedAt: true,
      },
    };
    this.exporting = false;
  }

  public export = (): void => {
    this.autoloading.emit(true);
    this.exporting = true;

    this.managePlacesService
      .autoExport(this.search, this.fileRequestParameters)
      .subscribe({
        next: (exportedFile: Blob) => {
          const extension =
            EXPORT_EXTENSIONS[this.fileRequestParameters.fileType];

          const newBlob = new Blob([exportedFile], {});

          saveAs(newBlob, "autoexport_soliguide" + extension);
          setTimeout(() => {
            this.cancelExport();
          }, 500);
        },
        error: () => {
          this.toastr.error(this.translateService.instant("UNEXPECTED_ERROR"));
          this.autoloading.emit(false);
          this.exporting = false;
        },
      });
  };

  public cancelExport = (): void => {
    this.autoloading.emit(false);
    this.exporting = false;
    this.modalService.dismissAll();
  };
}

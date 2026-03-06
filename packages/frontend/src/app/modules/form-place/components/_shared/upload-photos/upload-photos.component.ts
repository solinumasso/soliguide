import { Component, Input, OnInit } from "@angular/core";
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";

import { ToastrService } from "ngx-toastr";
import { UploadService } from "../../../services/upload.service";
import { Photo } from "../../../../../models";
import { UploadResponse } from "../../../../../shared/types";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-upload-photos",
  templateUrl: "./upload-photos.component.html",
  styleUrls: ["./upload-photos.component.css"],
})
export class UploadPhotosComponent implements OnInit {
  @Input() public photos!: Photo[];

  @Input() public placeId!: number;
  @Input() public parcoursId: number | null; // utile pour pour les photos dans les parcours de maraude

  @Input() public helpPhotos!: boolean;

  public fileName = "";
  public uploadResponse: UploadResponse;

  public submitted = false;
  public uploadForm!: UntypedFormGroup;

  public uploadError: {
    fileSize: boolean;
    fileType: boolean;
  };

  constructor(
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService,
    private uploadService: UploadService,
    private readonly translateService: TranslateService
  ) {
    this.parcoursId = null;
    this.uploadResponse = { status: "", message: 0, filePath: "" };
    this.submitted = false;

    this.uploadError = {
      fileSize: true,
      fileType: true,
    };
  }

  public ngOnInit(): void {
    this.uploadResponse = { status: "", message: 0, filePath: "" };

    this.uploadForm = this.formBuilder.group({
      imageInput: [this.fileName, Validators.required],
    });
  }

  public get u(): {
    [key: string]: AbstractControl;
  } {
    return this.uploadForm.controls;
  }

  public onFileChange = (event: Event): void => {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    const validFileExtensions = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];
    const type = file.type;
    const size = file.size;

    this.fileName = file.name;
    this.uploadError = {
      fileSize: size < 1024 * 1024 * 5,
      fileType: validFileExtensions.includes(type),
    };

    if (this.uploadError.fileSize && this.uploadError.fileType) {
      this.uploadForm.controls.imageInput.setValue(file);
      this.submitFile();
    }
  };

  public deletePhoto = (index: number, id: string): void => {
    this.uploadService
      .delete(id, this.placeId, "photos", this.parcoursId)
      .subscribe({
        next: () => {
          this.toastr.success(
            this.translateService.instant("DELETION_COMPLETED_SUCCESSFULLY")
          );
          this.photos.splice(index, 1);
        },
        error: () => {
          this.toastr.error(
            this.translateService.instant("DELETION_COULD_NOT_BE_COMPLETED")
          );
        },
      });
  };

  public submitFile = (): void => {
    this.submitted = true;
    this.uploadError = {
      fileSize: true,
      fileType: true,
    };

    if (this.uploadForm.invalid) {
      this.toastr.error(this.translateService.instant("CHECK_THE_FORM_FIELDS"));
      return;
    }

    const formData = new FormData();
    formData.append("file", this.uploadForm.controls.imageInput.value);

    if (this.parcoursId !== null) {
      formData.append("parcoursId", this.parcoursId.toString());
    }

    this.uploadService.upload(formData, this.placeId, "photos").subscribe({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      next: (res: any) => {
        this.uploadResponse = res;
        if (
          typeof this.uploadResponse.success !== "undefined" &&
          this.uploadResponse.success
        ) {
          this.photos.push(new Photo(this.uploadResponse.body));
          this.uploadForm.reset();
          this.fileName = "";
          this.submitted = false;
          this.toastr.success(
            this.translateService.instant("PHOTO_UPLOAD_SUCCESS")
          );
        }
      },
      error: () => {
        this.toastr.error(this.translateService.instant("ERROR_OCCURRED"));
      },
    });
  };
}

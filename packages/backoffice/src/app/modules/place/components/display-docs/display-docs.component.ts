import { Component, Input, OnDestroy, OnInit } from "@angular/core";

import { ToastrService } from "ngx-toastr";
import { UploadService } from "../../../form-place/services/upload.service";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { CommonPlaceDocument } from "@soliguide/common";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { PosthogComponent } from "../../../analytics/components/posthog.component";

@Component({
  selector: "app-display-docs",
  templateUrl: "./display-docs.component.html",
  styleUrls: ["./display-docs.component.scss"],
})
export class DisplayDocsComponent
  extends PosthogComponent
  implements OnDestroy, OnInit
{
  private readonly subscription = new Subscription();

  // Required
  @Input() public docs: CommonPlaceDocument[];

  // Optionnal
  @Input() public placeId: number;
  @Input() public serviceIndex: number;

  @Input() public displayDate: boolean;
  @Input() public canDownload: boolean;

  public canDelete: boolean;

  constructor(
    private readonly toastr: ToastrService,
    private readonly uploadService: UploadService,
    private readonly translateService: TranslateService,
    posthogService: PosthogService
  ) {
    super(posthogService, "display-docs-");
    this.displayDate = false;
    this.canDownload = false;
  }

  ngOnInit(): void {
    this.canDelete = typeof this.placeId !== "undefined";
  }

  public deleteDoc = (index: number, id: string): void => {
    this.captureEvent({
      name: "click-delete-doc-button",
      properties: { doc: this.docs[index] },
    });

    this.subscription.add(
      this.uploadService
        .delete(id, this.placeId, "documents", this.serviceIndex)
        .subscribe({
          next: () => {
            this.toastr.success(
              this.translateService.instant("DELETION_COMPLETED_SUCCESSFULLY")
            );
            this.docs.splice(index, 1);
          },
          error: () => {
            this.toastr.error(
              this.translateService.instant("DELETION_COULD_NOT_BE_COMPLETED")
            );
          },
        })
    );
  };

  public download = (doc: CommonPlaceDocument): void => {
    this.captureEvent({
      name: "click-download-doc-button",
      properties: { doc },
    });
    try {
      this.uploadService.getDocument(doc);
    } catch {
      this.toastr.error(this.translateService.instant("ERROR_OCCURRED"));
    }
  };

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

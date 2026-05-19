import { Component, Input, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { saveAs } from "file-saver";
import { Subscription } from "rxjs";

import { CommonPlaceDocument } from "@soliguide/common";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { PosthogComponent } from "../../../analytics/components/posthog.component";
import { environment } from "../../../../../environments/environment";

@Component({
  selector: "app-display-docs",
  templateUrl: "./display-docs.component.html",
  styleUrls: ["./display-docs.component.scss"],
})
export class DisplayDocsComponent
  extends PosthogComponent
  implements OnDestroy
{
  private readonly subscription = new Subscription();

  @Input() public docs: CommonPlaceDocument[];
  @Input() public displayDate: boolean;
  @Input() public canDownload: boolean;

  public readonly canDelete = false;

  constructor(
    private readonly http: HttpClient,
    posthogService: PosthogService
  ) {
    super(posthogService, "display-docs-");
    this.displayDate = false;
    this.canDownload = false;
  }

  public download = (doc: CommonPlaceDocument): void => {
    this.captureEvent({
      name: "click-download-doc-button",
      properties: { doc },
    });
    this.subscription.add(
      this.http
        .get(`${environment.apiUrl}/medias/documents/${doc.path}`, {
          responseType: "blob",
        })
        .subscribe({
          next: (file: Blob) => {
            saveAs(new Blob([file], { type: doc.mimetype }), doc.filename);
          },
        })
    );
  };

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

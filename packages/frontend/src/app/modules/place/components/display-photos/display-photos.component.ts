import { Component, Input, TemplateRef } from "@angular/core";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { Photo } from "../../../../models";
import { DEFAULT_MODAL_OPTIONS } from "../../../../shared";
import { PosthogComponent } from "../../../analytics/components/posthog.component";
import { PosthogService } from "../../../analytics/services/posthog.service";

@Component({
  selector: "app-display-photos",
  templateUrl: "./display-photos.component.html",
  styleUrls: ["./display-photos.component.scss"],
})
export class DisplayPhotosComponent extends PosthogComponent {
  @Input() public photos!: Photo[];
  @Input() public name!: string;
  @Input() public history!: boolean;

  public photoIndex: number;

  constructor(
    private readonly modalService: NgbModal,
    posthogService: PosthogService
  ) {
    super(posthogService, "display-photos");
    this.photoIndex = 0;
  }

  public openPhoto = (
    content: TemplateRef<HTMLElement>,
    index: number
  ): void => {
    this.captureEvent({
      name: "click-photo",
      properties: { photoIndex: index, photo: this.photos[index] },
    });
    this.photoIndex = index;
    this.modalService.open(content, { size: "lg", ...DEFAULT_MODAL_OPTIONS });
  };

  public closePhoto = () => {
    this.captureEvent({
      name: "click-close-photo-modal",
      properties: {
        lastPhotoIndex: this.photoIndex,
        lastPhoto: this.photos[this.photoIndex],
      },
    });
    this.modalService.dismissAll();
  };

  public captureCarouselEvent = (event) => {
    const previousIndex = parseInt(event.prev.replace("photo-", ""), 10);
    this.photoIndex = parseInt(event.current.replace("photo-", ""), 10);
    this.captureEvent({
      name: `click-carrousel-${
        event.source === "arrowLeft" ? "arrow-left" : "arrow-right"
      }`,
      properties: {
        previousIndex,
        currentIndex: this.photoIndex,
        previousPhoto: this.photos[previousIndex],
        currentPhoto: this.photos[this.photoIndex],
      },
    });
  };
}

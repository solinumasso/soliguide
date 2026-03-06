import { Component, Input } from "@angular/core";

import type { Modalities } from "@soliguide/common";
import { PosthogComponent } from "../../../analytics/components/posthog.component";
import { PosthogService } from "../../../analytics/services/posthog.service";

@Component({
  selector: "app-display-modalities-inline",
  templateUrl: "./display-modalities-inline.component.html",
  styleUrls: ["./display-modalities-inline.component.css"],
})
export class DisplayModalitiesInlineComponent extends PosthogComponent {
  @Input() public modalities: Modalities;

  constructor(posthogService: PosthogService) {
    super(posthogService, "display-modalities");
  }
}

import { Component, Input } from "@angular/core";
import { Place } from "../../../../models";
import { PosthogComponent } from "../../../analytics/components/posthog.component";
import { PosthogService } from "../../../analytics/services/posthog.service";

@Component({
  selector: "app-display-parcours-mobile",
  templateUrl: "./display-parcours-mobile.component.html",
  styleUrls: ["./display-parcours-mobile.component.css"],
})
export class DisplayParcoursMobileComponent extends PosthogComponent {
  @Input() public place!: Place;

  constructor(posthogService: PosthogService) {
    super(posthogService, "display-itinerary");
  }
}

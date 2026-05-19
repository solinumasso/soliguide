import { Component, Input } from "@angular/core";

import type { Modalities } from "@soliguide/common";

@Component({
  selector: "app-display-modalities",
  templateUrl: "./display-modalities.component.html",
  styleUrls: ["./display-modalities.component.css"],
})
export class DisplayModalitiesComponent {
  @Input() public modalities: Modalities;
  @Input() public isHistory: boolean;
}

import { Component, Input } from "@angular/core";
import { PlaceChanges } from "../../../../models";

@Component({
  selector: "app-display-place-changes-sections",
  templateUrl: "./display-place-changes-sections.component.html",
  styleUrls: ["./display-place-changes-sections.component.scss"],
})
export class DisplayPlaceChangesSectionsComponent {
  @Input() public placeChanges: PlaceChanges;
  @Input() public photosChanged: boolean;
}

import { Component, Input, OnInit } from "@angular/core";
import { PlaceSource } from "../../../../models/place/classes/place-sources.class";
import { EXTERNAL_SOURCE_MAPPING } from "@soliguide/common";

@Component({
  selector: "app-display-sources",
  templateUrl: "./display-sources.component.html",
  styleUrls: ["./display-sources.component.scss"],
})
export class DisplaySourcesComponent implements OnInit {
  @Input() public sources: PlaceSource[];

  public isAtLeastOneSourceMustBeDisplayed: boolean;
  public sourceName: string;

  public EXTERNAL_SOURCE_MAPPING = EXTERNAL_SOURCE_MAPPING;

  ngOnInit(): void {
    this.isAtLeastOneSourceMustBeDisplayed = this.sources.some(
      (source) => source?.toDisplay
    );
  }
}

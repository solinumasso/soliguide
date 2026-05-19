import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Logos } from "../../../../shared";
import { LocationService } from "../../../shared/services";

@Component({
  selector: "app-partners-logos",
  templateUrl: "./partners-logos.component.html",
  styleUrls: ["./partners-logos.component.scss"],
})
export class PartnersLogosComponent implements OnInit {
  public logosToDisplay: Logos[];

  private readonly subscription = new Subscription();

  constructor(private readonly locationService: LocationService) {
    this.logosToDisplay = [];
  }

  public ngOnInit(): void {
    // Fetch the list of logos to display depending on the selected territory
    this.subscription.add(
      this.locationService.logosToDisplaySubject.subscribe((logos: Logos[]) => {
        this.logosToDisplay = logos;
      })
    );
  }
}

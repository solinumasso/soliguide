import { Component, Input, OnInit } from "@angular/core";

import { PlaceContact } from "@soliguide/common";
import { PosthogComponent } from "../../../../analytics/components/posthog.component";
import { PosthogService } from "../../../../analytics/services/posthog.service";

@Component({
  selector: "app-single-contact",
  templateUrl: "./single-contact.component.html",
  styleUrls: ["./single-contact.component.css"],
})
export class SingleContactComponent extends PosthogComponent implements OnInit {
  @Input() public contact: PlaceContact;
  @Input() public index: number;

  constructor(posthogService: PosthogService) {
    super(posthogService, "single-contact");
    this.contact = null;
  }

  public ngOnInit(): void {
    this.updateDefaultPosthogProperties({
      contact: this.contact,
      index: this.index,
    });
  }
}

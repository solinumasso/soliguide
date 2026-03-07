import { Component, Input, OnInit } from "@angular/core";
import { SupportedLanguagesCode } from "@soliguide/common";
import { WidgetPlace } from "../../../../models";
import { fadeInOut } from "../../../../shared";

import { environment } from "../../../../../environments/environment";
import { PosthogService } from "../../../analytics/services/posthog.service";

@Component({
  animations: [fadeInOut],
  selector: "app-single-result",
  templateUrl: "./single-result.component.html",
  styleUrls: ["./single-result.component.scss"],
})
export class SingleResultComponent implements OnInit {
  @Input() public place!: WidgetPlace;
  @Input() public currentLang: SupportedLanguagesCode;
  @Input() public disabled: boolean;

  public soliguideLink = "";
  public osmLink = "";

  constructor(private readonly posthogService: PosthogService) {
    this.currentLang = SupportedLanguagesCode.FR;
    this.disabled = false;
  }

  public ngOnInit(): void {
    this.soliguideLink = `${environment.frontendUrl}/${this.currentLang}/fiche/${this.place.seo_url}`;
    this.osmLink =
      "https://www.openstreetmap.org/search?query=" +
      this.place.position.address;
  }

  public recordClick = async (eventName: string) => {
    await this.posthogService.capture(eventName, {
      place: this.place,
      currentLang: this.currentLang,
    });
  };
}

import { Component, Input, OnInit } from "@angular/core";

import { LEGACY_CATEGORIES, SupportedLanguagesCode } from "@soliguide/common";

import { Search, WidgetPlace } from "../../../../models";

import { fadeInOut } from "../../../../shared";

import { environment } from "../../../../../environments/environment";

import { PosthogService } from "../../../analytics/services/posthog.service";

@Component({
  animations: [fadeInOut],
  selector: "app-search-results",
  templateUrl: "./search-results.component.html",
  styleUrls: ["./search-results.component.scss"],
})
export class SearchResultsComponent implements OnInit {
  @Input() public loading: boolean;
  @Input() public places: WidgetPlace[];
  @Input() public search: Search;
  @Input() public disabled: boolean;

  public currentLang: SupportedLanguagesCode;
  public soliguideLink: string;
  public isDesktop: boolean;

  public readonly frontendUrl = environment.frontendUrl;

  public readonly LEGACY_CATEGORIES = LEGACY_CATEGORIES;

  constructor(private readonly posthogService: PosthogService) {
    this.loading = false;
    this.places = [];
    this.search = new Search();
    this.disabled = false;
    this.currentLang = SupportedLanguagesCode.FR;

    this.soliguideLink = "";
    this.isDesktop = window.innerWidth > 400;
  }

  public ngOnInit(): void {
    this.currentLang = this.search.lang;

    if (!this.disabled) {
      this.soliguideLink = `${this.frontendUrl}/${this.currentLang}/search/${this.search.location.geoValue}/`;

      if (this.search.category) {
        this.soliguideLink += this.search.category;
      } else if (this.search.categories?.length) {
        this.soliguideLink += this.search.categories[0];
      }
    } else {
      this.soliguideLink = "";
    }
  }

  public recordClick = async () => {
    await this.posthogService.capture("see-more-results", {
      currentLang: this.currentLang,
      search: this.search,
      isDesktop: this.isDesktop,
      soliguideLink: this.soliguideLink,
    });
  };
}

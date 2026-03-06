import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from "@angular/core";

import { Search } from "../../interfaces";

import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { PosthogService } from "../../../analytics/services/posthog.service";
import {
  FlatCategoriesTreeNode,
  getCategoriesService,
} from "@soliguide/common";
import { Subscription } from "rxjs";

@Component({
  selector: "app-search-nav",
  templateUrl: "./search-nav.component.html",
  styleUrls: ["./search-nav.component.css"],
})
export class SearchNavComponent implements OnInit, OnDestroy, OnChanges {
  private readonly subscription = new Subscription();
  public routePrefix: string;

  public readonly CATEGORIES_ROOTS =
    getCategoriesService().getOrderRootCategoriesIds();

  public categoryParentNode: FlatCategoriesTreeNode;

  @Input({ required: true }) public search: Search;

  constructor(
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly posthogService: PosthogService
  ) {
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(() => {
        this.routePrefix = this.currentLanguageService.routePrefix;
      })
    );
    this.updateCategoryNode();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes["search"]) {
      if (this.search) {
        this.updateCategoryNode();
      }
    }
  }

  private updateCategoryNode(): void {
    if (!this.search.category) {
      this.categoryParentNode = null;
      return;
    }

    const categoriesService = getCategoriesService();
    const parentCategories = categoriesService.getParentsCategories(
      this.search.category
    );

    const categoryParent = parentCategories[0];

    if (categoryParent) {
      this.categoryParentNode =
        categoriesService.getFlatCategoryTreeNode(categoryParent);
      return;
    }

    this.categoryParentNode = categoriesService.getFlatCategoryTreeNode(
      this.search.category
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public captureEvent(eventName: string) {
    this.posthogService.capture(`search-nav-${eventName}`, {
      search: this.search,
    });
  }
}

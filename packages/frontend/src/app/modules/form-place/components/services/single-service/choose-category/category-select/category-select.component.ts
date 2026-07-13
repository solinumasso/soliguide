import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";

import {
  Categories,
  CategoriesTreeNode,
  getCategoriesService,
} from "@soliguide/common";

import { TranslateService } from "@ngx-translate/core";

import { CategoryTreeService } from "./category-tree.service";

export interface CategoryPath {
  nodes: CategoriesTreeNode[]; // full path from root to leaf inclusive
}

export interface CategorySearchResult {
  node: CategoriesTreeNode;
  breadcrumb: CategoriesTreeNode[];
}

@Component({
  selector: "app-category-select",
  templateUrl: "./category-select.component.html",
  styleUrls: ["./category-select.component.scss"],
})
export class CategorySelectComponent implements OnChanges {
  @Input() public value: Categories | null = null;
  @Input() public serviceIndex = 0;
  @Input() public required = false;

  @Output() public readonly selectionChange = new EventEmitter<Categories>();

  public isOpen = false;
  public navigationPath: CategoriesTreeNode[] = [];
  public currentPath: CategoryPath | null = null;
  public searchQuery = "";
  public searchResults: CategorySearchResult[] = [];

  public readonly rootNodes: CategoriesTreeNode[] =
    getCategoriesService().getCategoriesTreeNode();

  public get currentItems(): CategoriesTreeNode[] {
    if (this.navigationPath.length === 0) return this.rootNodes;
    return this.navigationPath[this.navigationPath.length - 1].children;
  }

  public constructor(
    private readonly elementRef: ElementRef,
    private readonly translateService: TranslateService,
    private readonly categoryTreeService: CategoryTreeService
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes["value"]) {
      this.currentPath = this.value
        ? this.categoryTreeService.findPath(this.rootNodes, this.value)
        : null;
    }
  }

  public pathRoot(path: CategoryPath): CategoriesTreeNode {
    return path.nodes[0];
  }

  public pathLeaf(path: CategoryPath): CategoriesTreeNode {
    return path.nodes[path.nodes.length - 1];
  }

  @HostListener("document:click", ["$event"])
  public onDocumentClick(event: MouseEvent): void {
    if (!event.composedPath().includes(this.elementRef.nativeElement)) {
      this.isOpen = false;
    }
  }

  @HostListener("keydown", ["$event"])
  public onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen) return;

    const handledKeys = [
      "ArrowDown",
      "ArrowUp",
      "ArrowLeft",
      "ArrowRight",
      "Escape",
    ];
    if (!handledKeys.includes(event.key)) return;

    const isSearchInput = (event.target as HTMLElement).tagName === "INPUT";
    const isHorizontalArrow =
      event.key === "ArrowLeft" || event.key === "ArrowRight";

    // In search mode or when the text cursor is in the input, let ArrowLeft/Right move the cursor
    if (
      isHorizontalArrow &&
      (isSearchInput || Boolean(this.searchQuery.trim()))
    )
      return;

    event.preventDefault();
    event.stopPropagation();

    if (event.key === "Escape") this.handleEscapeKey();
    else if (event.key === "ArrowRight") this.handleArrowRightKey();
    else if (event.key === "ArrowLeft") this.handleArrowLeftKey();
    else this.handleVerticalNavigation(event.key as "ArrowDown" | "ArrowUp");
  }

  private handleEscapeKey(): void {
    if (this.searchQuery) {
      this.clearSearch();
    } else {
      this.isOpen = false;
    }
  }

  private handleArrowRightKey(): void {
    const focusableItems = this.getFocusableItems();
    const focusedIndex = focusableItems.indexOf(
      document.activeElement as HTMLElement
    );
    if (focusedIndex === -1) return;
    const node = this.currentItems[focusedIndex];
    if (node?.children.length) this.drillInto(node);
  }

  private handleArrowLeftKey(): void {
    if (this.navigationPath.length === 0) return;
    const parentItems =
      this.navigationPath.length === 1
        ? this.rootNodes
        : this.navigationPath[this.navigationPath.length - 2].children;
    const targetIndex = parentItems.indexOf(
      this.navigationPath[this.navigationPath.length - 1]
    );
    this.goBack();
    setTimeout(() => {
      const focusableItems = this.getFocusableItems();
      (focusableItems[targetIndex] ?? focusableItems[0])?.focus();
    });
  }

  private handleVerticalNavigation(key: "ArrowDown" | "ArrowUp"): void {
    const focusableItems = this.getFocusableItems();
    if (!focusableItems.length) return;
    const focusedIndex = focusableItems.indexOf(
      document.activeElement as HTMLElement
    );
    if (key === "ArrowDown") {
      focusableItems[
        focusedIndex === -1 ? 0 : (focusedIndex + 1) % focusableItems.length
      ].focus();
    } else {
      focusableItems[
        focusedIndex === -1
          ? focusableItems.length - 1
          : (focusedIndex - 1 + focusableItems.length) % focusableItems.length
      ].focus();
    }
  }

  public toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.navigationPath = [];
    } else {
      this.clearSearch();
    }
  }

  public drillInto(node: CategoriesTreeNode): void {
    if (node.children.length === 0) {
      this.emitAndClose(node.id);
    } else {
      this.navigationPath = [...this.navigationPath, node];
      setTimeout(() => this.getFocusableItems()[0]?.focus());
    }
  }

  public goBack(): void {
    this.navigationPath = this.navigationPath.slice(0, -1);
  }

  public onSearchChange(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.searchResults = [];
      return;
    }
    this.searchResults = this.categoryTreeService.searchLeaves(
      this.rootNodes,
      query,
      (node) => this.labelOf(node)
    );
  }

  public selectSearchResult(result: CategorySearchResult): void {
    this.clearSearch();
    this.emitAndClose(result.node.id);
  }

  private labelOf(node: CategoriesTreeNode): string {
    return this.translateService
      .instant(`CAT_${node.id.toUpperCase()}`)
      .toLowerCase();
  }

  private clearSearch(): void {
    this.searchQuery = "";
    this.searchResults = [];
  }

  private getFocusableItems(): HTMLElement[] {
    const panel: HTMLElement | null =
      this.elementRef.nativeElement.querySelector(".category-select__panel");
    if (!panel) return [];
    return Array.from(panel.querySelectorAll<HTMLElement>('[role="menuitem"]'));
  }

  private emitAndClose(category: Categories): void {
    this.isOpen = false;
    this.selectionChange.emit(category);
  }
}

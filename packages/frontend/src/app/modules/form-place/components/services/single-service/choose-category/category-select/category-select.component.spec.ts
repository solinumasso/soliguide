import { APP_BASE_HREF } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { TranslateModule } from "@ngx-translate/core";

import {
  Categories,
  CategoriesTreeNode,
  initializeCategoriesByTheme,
  Themes,
} from "@soliguide/common";

import { CategoryTranslateKeyPipe } from "../../../../../../shared/pipes";
import {
  CategorySelectComponent,
  CategoryPath,
} from "./category-select.component";
import { CategoryTreeService } from "./category-tree.service";

beforeAll(() => {
  initializeCategoriesByTheme(Themes.SOLIGUIDE_FR);
});

const makeMockNode = (
  id: string,
  children: CategoriesTreeNode[] = []
): CategoriesTreeNode => ({
  id: id as Categories,
  children,
  depth: 0,
  parent: null,
  rootParent: id as Categories,
  rank: 1,
});

const MOCK_LEAF = makeMockNode("mock-leaf");
const MOCK_ROOT = makeMockNode("mock-root", [MOCK_LEAF]);
const MOCK_PATH: CategoryPath = { nodes: [MOCK_ROOT, MOCK_LEAF] };

describe("CategorySelectComponent", () => {
  let component: CategorySelectComponent;
  let fixture: ComponentFixture<CategorySelectComponent>;
  let categoryTreeService: jest.Mocked<CategoryTreeService>;

  beforeEach(waitForAsync(() => {
    const categoryTreeServiceMock: Partial<jest.Mocked<CategoryTreeService>> = {
      findPath: jest.fn().mockReturnValue(null),
      searchLeaves: jest.fn().mockReturnValue([]),
    };

    TestBed.configureTestingModule({
      declarations: [CategorySelectComponent, CategoryTranslateKeyPipe],
      imports: [FormsModule, TranslateModule.forRoot({})],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: CategoryTreeService, useValue: categoryTreeServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorySelectComponent);
    component = fixture.componentInstance;
    categoryTreeService = TestBed.inject(
      CategoryTreeService
    ) as jest.Mocked<CategoryTreeService>;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnChanges", () => {
    it("sets currentPath via categoryTreeService.findPath when value is provided", () => {
      categoryTreeService.findPath.mockReturnValue(MOCK_PATH);
      // value must be set on the component before calling ngOnChanges,
      // because the handler reads this.value (not changes.value.currentValue)
      component.value = Categories.FOOD;

      component.ngOnChanges({
        value: new SimpleChange(null, Categories.FOOD, false),
      });

      expect(categoryTreeService.findPath).toHaveBeenCalledWith(
        component.rootNodes,
        Categories.FOOD
      );
      expect(component.currentPath).toBe(MOCK_PATH);
    });

    it("sets currentPath to null when value is null", () => {
      component.currentPath = MOCK_PATH;
      component.value = null;

      component.ngOnChanges({
        value: new SimpleChange(Categories.FOOD, null, false),
      });

      expect(component.currentPath).toBeNull();
      expect(categoryTreeService.findPath).not.toHaveBeenCalled();
    });

    it("does not touch currentPath when a change key other than value is provided", () => {
      component.currentPath = MOCK_PATH;

      component.ngOnChanges({
        serviceIndex: new SimpleChange(0, 1, false),
      });

      expect(component.currentPath).toBe(MOCK_PATH);
    });
  });

  describe("pathRoot", () => {
    it("returns the first node in the path", () => {
      expect(component.pathRoot(MOCK_PATH)).toBe(MOCK_ROOT);
    });
  });

  describe("pathLeaf", () => {
    it("returns the last node in the path", () => {
      expect(component.pathLeaf(MOCK_PATH)).toBe(MOCK_LEAF);
    });

    it("returns the only node when the path has a single node", () => {
      const singleNodePath: CategoryPath = { nodes: [MOCK_ROOT] };
      expect(component.pathLeaf(singleNodePath)).toBe(MOCK_ROOT);
    });
  });

  describe("toggleDropdown", () => {
    it("opens the panel and resets navigationPath when closed", () => {
      component.isOpen = false;
      component.navigationPath = [MOCK_ROOT];

      component.toggleDropdown();

      expect(component.isOpen).toBe(true);
      expect(component.navigationPath).toEqual([]);
    });

    it("closes the panel and clears search when open", () => {
      component.isOpen = true;
      component.searchQuery = "some query";
      component.searchResults = [{ node: MOCK_LEAF, breadcrumb: [MOCK_ROOT] }];

      component.toggleDropdown();

      expect(component.isOpen).toBe(false);
      expect(component.searchQuery).toBe("");
      expect(component.searchResults).toEqual([]);
    });
  });

  describe("drillInto", () => {
    it("emits selectionChange and closes when the node is a leaf", () => {
      component.isOpen = true;
      const selectionChangeSpy = jest.spyOn(component.selectionChange, "emit");

      component.drillInto(MOCK_LEAF);

      expect(selectionChangeSpy).toHaveBeenCalledWith(MOCK_LEAF.id);
      expect(component.isOpen).toBe(false);
    });

    it("appends the node to navigationPath when it has children", () => {
      component.isOpen = true;
      component.navigationPath = [];

      component.drillInto(MOCK_ROOT);

      expect(component.navigationPath).toEqual([MOCK_ROOT]);
      expect(component.isOpen).toBe(true);
    });
  });

  describe("goBack", () => {
    it("removes the last entry from navigationPath", () => {
      component.navigationPath = [MOCK_ROOT, MOCK_LEAF];

      component.goBack();

      expect(component.navigationPath).toEqual([MOCK_ROOT]);
    });

    it("results in an empty navigationPath when already at depth 1", () => {
      component.navigationPath = [MOCK_ROOT];

      component.goBack();

      expect(component.navigationPath).toEqual([]);
    });
  });

  describe("currentItems", () => {
    it("returns rootNodes when navigationPath is empty", () => {
      component.navigationPath = [];
      expect(component.currentItems).toBe(component.rootNodes);
    });

    it("returns the children of the last node in navigationPath when drilled in", () => {
      component.navigationPath = [MOCK_ROOT];
      expect(component.currentItems).toEqual(MOCK_ROOT.children);
    });
  });

  describe("onSearchChange", () => {
    it("delegates to categoryTreeService.searchLeaves with the lowercased trimmed query", () => {
      const mockResults = [{ node: MOCK_LEAF, breadcrumb: [MOCK_ROOT] }];
      categoryTreeService.searchLeaves.mockReturnValue(mockResults);
      component.searchQuery = "  Food  ";

      component.onSearchChange();

      expect(categoryTreeService.searchLeaves).toHaveBeenCalledWith(
        component.rootNodes,
        "food",
        expect.any(Function)
      );
      expect(component.searchResults).toBe(mockResults);
    });

    it("clears searchResults without calling the service when query is blank", () => {
      component.searchResults = [{ node: MOCK_LEAF, breadcrumb: [] }];
      component.searchQuery = "   ";

      component.onSearchChange();

      expect(categoryTreeService.searchLeaves).not.toHaveBeenCalled();
      expect(component.searchResults).toEqual([]);
    });
  });

  describe("selectSearchResult", () => {
    it("clears search state, emits selectionChange and closes the panel", () => {
      component.isOpen = true;
      component.searchQuery = "food";
      component.searchResults = [{ node: MOCK_LEAF, breadcrumb: [] }];
      const selectionChangeSpy = jest.spyOn(component.selectionChange, "emit");

      component.selectSearchResult({ node: MOCK_LEAF, breadcrumb: [] });

      expect(component.searchQuery).toBe("");
      expect(component.searchResults).toEqual([]);
      expect(selectionChangeSpy).toHaveBeenCalledWith(MOCK_LEAF.id);
      expect(component.isOpen).toBe(false);
    });
  });
});

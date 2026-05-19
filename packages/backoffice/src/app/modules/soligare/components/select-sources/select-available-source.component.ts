import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Subscription, forkJoin } from "rxjs";
import Fuse from "fuse.js";

import { AnyDepartmentCode } from "@soliguide/common";

import { User } from "../../../users/classes/user.class";
import { AuthService } from "../../../users/services/auth.service";
import { globalConstants } from "../../../../shared";
import { CurrentLanguageService } from "../../../general/services/current-language.service";

@Component({
  selector: "app-select-available-source",
  templateUrl: "./select-available-source.component.html",
})
export class SelectAvailableSourceComponent implements OnInit {
  @Input() public isRequired!: boolean;
  @Input() public submitted!: boolean;
  @Input() public label!: string;
  @Input() public availableSource!: string[];
  @Input() public sources!: string[];
  @Input() public availableSourceFormControl!: AbstractControl;
  @Input() public disabled: boolean;
  @Input() public territories: AnyDepartmentCode[];

  @Output() public readonly selectedAvailableSource = new EventEmitter<
    string[]
  >();

  private me!: User | null;
  private fuse = new Fuse([]);

  public localAvailableSource: string[];
  public stringToDisplay: string;
  public filter: string;

  public haveBeenTouched = false;

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly authService: AuthService,
    private readonly translateService: TranslateService,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    this.disabled = false;
    this.filter = "";

    this.localAvailableSource = [];
  }

  public ngOnInit(): void {
    this.availableSource = this.availableSourceFormControl
      ? this.availableSourceFormControl.value
      : [];

    this.me = this.authService.currentUserValue;

    if (!this.territories.length) {
      this.territories = this.me.territories;
    }

    const searchPairing = globalConstants.getItem("SOLIGARE_SEARCH");
    this.localAvailableSource = searchPairing?.sources ?? [];

    this.fuse = new Fuse(this.availableSource, {
      keys: ["source"],
      threshold: 0.2,
    });

    this.filterSources();
    this.getStringToDisplay();

    this.subscription.add(
      this.currentLanguageService.subscribe(() => {
        this.filterSources();
        this.getStringToDisplay();
      })
    );
  }

  public filterSources(): void {
    this.fuse.setCollection(this.availableSource);
    const sources = this.filter
      ? this.fuse.search(this.filter).map((result) => result.item)
      : this.availableSource;

    this.sources = this.sortSources(sources);
  }

  private sortSources(sources: string[]) {
    return sources.sort((a, b) => a.localeCompare(b));
  }

  public getStringToDisplay(): void {
    forkJoin({
      none: this.translateService.get("NONE"),
      allSources: this.translateService.get("ALL_SOURCES"),
    }).subscribe((translation) => {
      if (
        this.localAvailableSource.length === this.availableSource.length &&
        this.availableSource.length > 0
      ) {
        this.stringToDisplay = translation.allSources;
      } else if (this.localAvailableSource.length > 0) {
        this.stringToDisplay = this.localAvailableSource.join(", ");
      } else {
        this.stringToDisplay = translation.none;
      }
    });
  }

  public updateAvailableSource() {
    this.availableSourceFormControl
      ? this.availableSourceFormControl.setValue(this.localAvailableSource)
      : this.selectedAvailableSource.emit(this.localAvailableSource);
  }

  public selectAll(): void {
    this.localAvailableSource =
      this.localAvailableSource.length !== this.availableSource.length
        ? this.availableSource.map((source) => source)
        : [];

    this.updateAvailableSource();
    this.haveBeenTouched = true;
    this.getStringToDisplay();
  }

  public toggleCheckboxButton(key: string): void {
    const index = this.localAvailableSource.indexOf(key);

    if (index !== -1) {
      this.localAvailableSource.splice(index, 1);
    } else {
      this.localAvailableSource.push(key);
    }
    this.updateAvailableSource();
    this.haveBeenTouched = true;
    this.getStringToDisplay();
  }
}

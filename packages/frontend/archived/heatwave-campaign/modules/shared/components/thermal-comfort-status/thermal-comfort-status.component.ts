import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { NgClass, NgIf } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { RouterLink } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import {
  isSummerSeason,
  isWinterSeason,
  shouldDisplayThermalComfort,
  type SoliguideCountries,
  type ThermalComfortData,
} from "@soliguide/common";

import { THEME_CONFIGURATION } from "../../../../models";

@Component({
  selector: "app-thermal-comfort-status",
  standalone: true,
  imports: [NgIf, NgClass, TranslateModule, RouterLink, FontAwesomeModule],
  templateUrl: "./thermal-comfort-status.component.html",
  styleUrls: ["./thermal-comfort-status.component.css"],
})
export class ThermalComfortStatusComponent implements OnInit {
  @Input() public thermalComfort: ThermalComfortData | null = null;
  @Input() public variant: "card" | "banner" | "ribbon" = "card";
  @Input() public showMissingCta = false;
  @Input() public editRouterLink: unknown[] | string | null = null;
  // Optional override — falls back to THEME_CONFIGURATION.country when omitted.
  @Input() public country: SoliguideCountries | null | undefined = undefined;

  @Output() public readonly updateRequested = new EventEmitter<void>();

  @HostBinding("class.thermal-comfort-status-host--ribbon")
  public isRibbonHost = false;

  public shouldDisplay = false;
  public isAirConditionedRibbon = false;
  public isNotAirConditionedRibbon = false;
  public isWinterRibbon = false;
  public isSummer = false;
  public isWinter = false;
  public isMissing = false;
  // True when a ribbon overlay is actually rendered. Consumers use this to
  // reserve layout space so the ribbon does not cover neighbouring content.
  public isRibbonVisible = false;

  public ngOnInit(): void {
    this.isRibbonHost = this.variant === "ribbon";
    this.shouldDisplay = shouldDisplayThermalComfort(
      this.country ?? THEME_CONFIGURATION.country
    );
    this.isSummer =
      this.thermalComfort?.airConditioned === true && isSummerSeason();
    this.isWinter = this.thermalComfort?.heated === true && isWinterSeason();
    this.isAirConditionedRibbon =
      this.variant === "ribbon" && this.thermalComfort?.airConditioned === true;
    this.isNotAirConditionedRibbon =
      this.variant === "ribbon" &&
      this.thermalComfort?.airConditioned === false;
    this.isWinterRibbon =
      this.variant === "ribbon" &&
      this.isWinter &&
      this.thermalComfort?.airConditioned == null;
    this.isMissing =
      !this.thermalComfort ||
      (this.thermalComfort.airConditioned == null &&
        this.thermalComfort.heated == null);
    this.isRibbonVisible =
      this.shouldDisplay &&
      this.variant === "ribbon" &&
      (this.isAirConditionedRibbon ||
        this.isNotAirConditionedRibbon ||
        this.isWinterRibbon);
  }

  public onCtaClick(): void {
    this.updateRequested.emit();
  }
}

import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from "@angular/core";
import { NgClass, NgIf } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { RouterLink } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import type { ThermalComfortData } from "@soliguide/common";

@Component({
  selector: "app-thermal-comfort-status",
  standalone: true,
  imports: [NgIf, NgClass, TranslateModule, RouterLink, FontAwesomeModule],
  templateUrl: "./thermal-comfort-status.component.html",
  styleUrls: ["./thermal-comfort-status.component.css"],
})
export class ThermalComfortStatusComponent {
  @Input() public thermalComfort: ThermalComfortData | null = null;
  @Input() public variant: "card" | "banner" | "ribbon" = "card";
  @Input() public showMissingCta = false;
  @Input() public editRouterLink: unknown[] | string | null = null;

  @Output() public readonly updateRequested = new EventEmitter<void>();

  @HostBinding("class.thermal-comfort-status-host--ribbon")
  public get isRibbonHost(): boolean {
    return this.variant === "ribbon";
  }

  public get isSummer(): boolean {
    return (
      this.thermalComfort?.airConditioned === true && this.isSummerSeason()
    );
  }

  public get isWinter(): boolean {
    return this.thermalComfort?.heated === true && this.isWinterSeason();
  }

  public get isMissing(): boolean {
    return (
      !this.thermalComfort ||
      (this.thermalComfort.airConditioned == null &&
        this.thermalComfort.heated == null)
    );
  }

  public onCtaClick(): void {
    this.updateRequested.emit();
  }

  // Summer season: June (6) → September (9).
  private isSummerSeason(now: Date = new Date()): boolean {
    const month = now.getMonth() + 1;
    return month >= 6 && month <= 9;
  }

  // Winter season: November → early March (until March 10th).
  private isWinterSeason(now: Date = new Date()): boolean {
    const month = now.getMonth() + 1;
    if (month === 11 || month === 12 || month === 1 || month === 2) {
      return true;
    }
    return month === 3 && now.getDate() <= 10;
  }
}

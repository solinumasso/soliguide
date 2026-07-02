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
    return this.thermalComfort?.airConditioned === true;
  }

  public get isWinter(): boolean {
    return this.thermalComfort?.heated === true;
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
}

import { Component, OnInit } from "@angular/core";
import { CountryCodes, getCountryFromTheme } from "@soliguide/common";
import { themeService } from "../../../../shared/services/theme.service";
import { LogoWithLink } from "../../../../shared/constants";
import {
  getLogosForCountry,
  getFunderNamesForCountry,
} from "src/app/shared/functions/getLogosForCountry";

@Component({
  selector: "app-partners-banner",
  templateUrl: "./partners-banner.component.html",
  styleUrls: ["./partners-banner.component.css"],
})
export class PartnersBannerComponent implements OnInit {
  public logos: LogoWithLink[] = [];
  private currentCountry!: CountryCodes;

  ngOnInit(): void {
    this.currentCountry = getCountryFromTheme(themeService.getTheme());
    this.logos = getLogosForCountry(this.currentCountry);
  }

  getFunderLogos(): LogoWithLink[] {
    const funderNames = getFunderNamesForCountry(this.currentCountry);
    return this.logos.filter((logo) => funderNames.includes(logo.alt));
  }

  getDeployerLogos(): LogoWithLink[] {
    const funderNames = getFunderNamesForCountry(this.currentCountry);
    return this.logos.filter((logo) => !funderNames.includes(logo.alt));
  }
}

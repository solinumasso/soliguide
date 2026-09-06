import { Component, Input } from "@angular/core";
import { NgFor, NgIf, UpperCasePipe } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

import {
  type RegistrationScheme,
  type Registrations,
  getRegistrationRegistryUrl,
  getRegistrationSchemesForCountry,
} from "@soliguide/common";

import { THEME_CONFIGURATION } from "../../../../models";

interface DisplayedRegistration {
  scheme: RegistrationScheme;
  value: string;
  /** Public reference website (SIRENE, data-asso...) or null when none exists */
  registryUrl: string | null;
}

/**
 * Read-only list of the official identifiers of a place or an organization,
 * in the order of the current country's schemes.
 */
@Component({
  selector: "app-display-registrations",
  templateUrl: "./display-registrations.component.html",
  standalone: true,
  imports: [NgFor, NgIf, TranslateModule, UpperCasePipe],
})
export class DisplayRegistrationsComponent {
  @Input({ required: true }) public registrations!: Registrations;

  public readonly schemes: RegistrationScheme[] =
    getRegistrationSchemesForCountry(THEME_CONFIGURATION.country);

  /** Identifiers of the current country that have a value, with their reference link */
  public get displayedRegistrations(): DisplayedRegistration[] {
    return this.schemes
      .filter((scheme) => !!this.registrations?.[scheme]?.value)
      .map((scheme) => {
        const value = this.registrations[scheme]?.value ?? "";
        return {
          scheme,
          value,
          registryUrl: getRegistrationRegistryUrl(scheme, value),
        };
      });
  }
}

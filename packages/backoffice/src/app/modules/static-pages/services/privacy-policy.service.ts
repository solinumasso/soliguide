import { Injectable } from "@angular/core";
import { Themes, SupportedLanguagesCode } from "@soliguide/common";
import { getStaticPageComponentByName } from "./static-pages.service";
import { PrivacyPolicySoliguideFrComponent } from "../components/privacy-policy/privacy-policy-soliguide-fr/privacy-policy-soliguide-fr.component";
import { PrivacyPolicySoliguiaCaComponent } from "../components/privacy-policy/privacy-policy-soliguia-ca/privacy-policy-soliguia-ca.component";
import { PrivacyPolicySoliguiaEsComponent } from "../components/privacy-policy/privacy-policy-soliguia-es/privacy-policy-soliguia-es.component";
import { componentStaticPage } from "../models";

@Injectable({
  providedIn: "root",
})
export class PrivacyPolicyService {
  private readonly allPrivacyPolicyTheme: componentStaticPage[] = [
    {
      theme: Themes.SOLIGUIDE_FR,
      lang: SupportedLanguagesCode.FR,
      component: PrivacyPolicySoliguideFrComponent,
      defaultTheme: true,
      default: true,
    },
    {
      theme: Themes.SOLIGUIA_ES,
      lang: SupportedLanguagesCode.ES,
      component: PrivacyPolicySoliguiaEsComponent,
      defaultTheme: true,
      default: false,
    },
    {
      theme: Themes.SOLIGUIA_AD,
      lang: SupportedLanguagesCode.CA,
      component: PrivacyPolicySoliguiaCaComponent,
      defaultTheme: false,
      default: false,
    },
  ];

  getPrivacyPolicyComponentByName(theme: string, lang: string) {
    return getStaticPageComponentByName(
      this.allPrivacyPolicyTheme,
      theme,
      lang
    );
  }
}

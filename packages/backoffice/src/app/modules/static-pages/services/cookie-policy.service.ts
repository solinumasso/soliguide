import { Injectable } from "@angular/core";
import { Themes, SupportedLanguagesCode } from "@soliguide/common";
import { getStaticPageComponentByName } from "./static-pages.service";
import { CookiePolicySoliguideFrComponent } from "../components/cookie-policy/cookie-policy-soliguide-fr/cookie-policy-soliguide-fr.component";
import { CookiePolicySoliguiaCaComponent } from "../components/cookie-policy/cookie-policy-soliguia-ca/cookie-policy-soliguia-ca.component";
import { CookiePolicySoliguiaEsComponent } from "../components/cookie-policy/cookie-policy-soliguia-es/cookie-policy-soliguia-es.component";
import { componentStaticPage } from "../models";

@Injectable({
  providedIn: "root",
})
export class CookiePolicyService {
  private readonly allCookiePolicyTheme: componentStaticPage[] = [
    {
      theme: Themes.SOLIGUIDE_FR,
      lang: SupportedLanguagesCode.FR,
      component: CookiePolicySoliguideFrComponent,
      defaultTheme: true,
      default: true,
    },
    {
      theme: Themes.SOLIGUIA_ES,
      lang: SupportedLanguagesCode.ES,
      component: CookiePolicySoliguiaEsComponent,
      defaultTheme: true,
      default: false,
    },
    {
      theme: Themes.SOLIGUIA_AD,
      lang: SupportedLanguagesCode.CA,
      component: CookiePolicySoliguiaCaComponent,
      defaultTheme: false,
      default: false,
    },
  ];

  getCookiePolicyComponentByName(theme: string, lang: string) {
    return getStaticPageComponentByName(this.allCookiePolicyTheme, theme, lang);
  }
}

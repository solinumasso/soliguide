import { Injectable } from "@angular/core";
import { Themes, SupportedLanguagesCode } from "@soliguide/common";
import { LegalNoticesSoliguideFrComponent } from "../components/legal-notices/legal-notices-soliguide-fr/legal-notices-soliguide-fr.component";
import { LegalNoticesSoliguiaCaComponent } from "../components/legal-notices/legal-notices-soliguia-ca/legal-notices-soliguia-ca.component";
import { LegalNoticesSoliguiaEsComponent } from "../components/legal-notices/legal-notices-soliguia-es/legal-notices-soliguia-es.component";
import { getStaticPageComponentByName } from "./static-pages.service";
import { componentStaticPage } from "../models";

@Injectable({
  providedIn: "root",
})
export class LegalNoticesService {
  private readonly allLegalNoticeTheme: componentStaticPage[] = [
    {
      theme: Themes.SOLIGUIDE_FR,
      lang: SupportedLanguagesCode.FR,
      component: LegalNoticesSoliguideFrComponent,
      defaultTheme: true,
      default: true,
    },
    {
      theme: Themes.SOLIGUIA_ES,
      lang: SupportedLanguagesCode.ES,
      component: LegalNoticesSoliguiaEsComponent,
      defaultTheme: true,
      default: false,
    },
    {
      theme: Themes.SOLIGUIA_AD,
      lang: SupportedLanguagesCode.CA,
      component: LegalNoticesSoliguiaCaComponent,
      defaultTheme: false,
      default: false,
    },
  ];

  getLegalNoticeComponentByName(theme: string, lang: string) {
    return getStaticPageComponentByName(this.allLegalNoticeTheme, theme, lang);
  }
}

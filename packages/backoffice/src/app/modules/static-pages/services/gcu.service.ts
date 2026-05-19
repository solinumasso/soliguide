import { Injectable } from "@angular/core";
import { Themes, SupportedLanguagesCode } from "@soliguide/common";
import { getStaticPageComponentByName } from "./static-pages.service";
import { GcuSoliguideFrComponent } from "../components/gcu/gcu-soliguide-fr/gcu-soliguide-fr.component";
import { GcuSoliguiaCaComponent } from "../components/gcu/gcu-soliguia-ca/gcu-soliguia-ca.component";
import { GcuSoliguiaEsComponent } from "../components/gcu/gcu-soliguia-es/gcu-soliguia-es.component";
import { componentStaticPage } from "../models";

@Injectable({
  providedIn: "root",
})
export class GcuService {
  private readonly allGCUTheme: componentStaticPage[] = [
    {
      theme: Themes.SOLIGUIDE_FR,
      lang: SupportedLanguagesCode.FR,
      component: GcuSoliguideFrComponent,
      defaultTheme: true,
      default: true,
    },
    {
      theme: Themes.SOLIGUIA_ES,
      lang: SupportedLanguagesCode.ES,
      component: GcuSoliguiaEsComponent,
      defaultTheme: true,
      default: false,
    },
    {
      theme: Themes.SOLIGUIA_AD,
      lang: SupportedLanguagesCode.CA,
      component: GcuSoliguiaCaComponent,
      defaultTheme: false,
      default: false,
    },
  ];

  getGCUComponentByName(theme: string, lang: string) {
    return getStaticPageComponentByName(this.allGCUTheme, theme, lang);
  }
}

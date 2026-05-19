import { Injectable } from "@angular/core";
import { Themes, SupportedLanguagesCode } from "@soliguide/common";
import { getStaticPageComponentByName } from "./static-pages.service";
import { DataProcessingAgreementSoliguideFrComponent } from "../components/data-processing-agreement/data-processing-agreement-soliguide-fr/data-processing-agreement-soliguide-fr.component";
import { DataProcessingAgreementSoliguiaCaComponent } from "../components/data-processing-agreement/data-processing-agreement-soliguia-ca/data-processing-agreement-soliguia-ca.component";
import { DataProcessingAgreementSoliguiaEsComponent } from "../components/data-processing-agreement/data-processing-agreement-soliguia-es/data-processing-agreement-soliguia-es.component";
import { componentStaticPage } from "../models";
@Injectable({
  providedIn: "root",
})
export class DataProcessingAgreementService {
  private readonly allDataProcessingAgreementTheme: componentStaticPage[] = [
    {
      theme: Themes.SOLIGUIDE_FR,
      lang: SupportedLanguagesCode.FR,
      component: DataProcessingAgreementSoliguideFrComponent,
      defaultTheme: true,
      default: true,
    },
    {
      theme: Themes.SOLIGUIA_ES,
      lang: SupportedLanguagesCode.ES,
      component: DataProcessingAgreementSoliguiaEsComponent,
      defaultTheme: true,
      default: false,
    },
    {
      theme: Themes.SOLIGUIA_AD,
      lang: SupportedLanguagesCode.CA,
      component: DataProcessingAgreementSoliguiaCaComponent,
      defaultTheme: false,
      default: false,
    },
  ];

  getDataProcessingAgreementComponentByName(theme: string, lang: string) {
    return getStaticPageComponentByName(
      this.allDataProcessingAgreementTheme,
      theme,
      lang
    );
  }
}

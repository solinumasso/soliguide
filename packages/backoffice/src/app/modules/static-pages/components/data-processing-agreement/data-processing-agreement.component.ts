import { Component, OnInit } from "@angular/core";
import { NgComponentOutlet } from "@angular/common";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { DataProcessingAgreementService } from "../../services/data-processing-agreement.service";
import { SeoService } from "../../../shared/services";
import { StaticPagesComponentAbstract } from "../static-pages-component.abstract";
import { TranslateService } from "@ngx-translate/core";

@Component({
  standalone: true,
  imports: [NgComponentOutlet],
  selector: "app-data-processing-agreement",
  template: '<ng-container *ngComponentOutlet="currentTemplate" />',
})
export class DataProcessingAgreementComponent
  extends StaticPagesComponentAbstract
  implements OnInit
{
  constructor(
    private readonly translateService: TranslateService,
    private readonly seoService: SeoService,
    private readonly dataProcessingAgreementService: DataProcessingAgreementService,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.translateService
      .stream([
        "STATIC_PAGE_DATA_PROCESSING_AGREEMENT_TITLE",
        "STATIC_PAGE_DATA_PROCESSING_AGREEMENT_DESCRIPTION",
      ])
      .subscribe((translations) => {
        const title =
          translations["STATIC_PAGE_DATA_PROCESSING_AGREEMENT_TITLE"];
        const description =
          translations["STATIC_PAGE_DATA_PROCESSING_AGREEMENT_DESCRIPTION"];

        this.seoService.updateTitleAndTags(title, description, true);
      });

    this.currentTemplate =
      this.dataProcessingAgreementService.getDataProcessingAgreementComponentByName(
        this.theme,
        this.currentLanguageService.currentLanguage
      );
  }
}

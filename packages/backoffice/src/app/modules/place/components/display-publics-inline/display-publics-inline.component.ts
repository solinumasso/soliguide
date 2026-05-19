import { Component, Input, OnChanges } from "@angular/core";

import {
  I18nTranslator,
  Publics,
  PublicsOther,
  translatePublics,
  WelcomedPublics,
} from "@soliguide/common";

import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { NgxTranslateI18nextAdapter } from "../../../shared/services/ngx-translate-i18next-adaptater.service";

@Component({
  selector: "app-display-publics-inline",
  templateUrl: "./display-publics-inline.component.html",
  styleUrls: ["./display-publics-inline.component.css"],
})
export class DisplayPublicsInlineComponent implements OnChanges {
  @Input() public publics!: Publics;

  public publicsText: string;

  public readonly PublicsOther = PublicsOther;
  public readonly WelcomedPublics = WelcomedPublics;

  constructor(
    private readonly adaptater: NgxTranslateI18nextAdapter,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    this.publicsText = "";
  }

  public ngOnChanges(): void {
    this.publicsText = translatePublics(
      this.adaptater as unknown as I18nTranslator,
      this.currentLanguageService.currentLanguage,
      this.publics,
      true,
      false
    );
  }
}

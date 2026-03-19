import { Component, OnInit, Input } from "@angular/core";

import {
  I18nTranslator,
  Publics,
  translatePublics,
  WelcomedPublics,
} from "@soliguide/common";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { NgxTranslateI18nextAdapter } from "../../../shared/services/ngx-translate-i18next-adaptater.service";

@Component({
  selector: "app-display-publics-admin",
  templateUrl: "./display-public-admin.component.html",
  styleUrls: ["./display-public-admin.component.css"],
})
export class DisplayPublicAdminComponent implements OnInit {
  @Input() public publics!: Publics;
  @Input() public languages!: string[];
  @Input() public languagesAdded: string[] = [];
  @Input() public languagesRemoved: string[] = [];

  public publicsText: string = "";

  public readonly WelcomedPublics = WelcomedPublics;

  constructor(
    private readonly adaptater: NgxTranslateI18nextAdapter,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    this.publicsText = "";
  }

  public ngOnInit(): void {
    this.publicsText = translatePublics(
      this.adaptater as unknown as I18nTranslator,
      this.currentLanguageService.currentLanguage,
      this.publics,
      true,
      false
    );
  }
}

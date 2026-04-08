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
  @Input() public oldPublics?: Publics;

  public publicsText: string = "";
  public accueilChanged = false;
  public detailsChanged = false;

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

    if (this.oldPublics) {
      this.accueilChanged = this.oldPublics.accueil !== this.publics.accueil;
      this.detailsChanged =
        !this.sameUnordered(this.oldPublics.gender, this.publics.gender) ||
        !this.sameUnordered(
          this.oldPublics.administrative,
          this.publics.administrative
        ) ||
        !this.sameUnordered(
          this.oldPublics.familialle,
          this.publics.familialle
        ) ||
        !this.sameUnordered(this.oldPublics.other, this.publics.other) ||
        this.oldPublics.age?.min !== this.publics.age?.min ||
        this.oldPublics.age?.max !== this.publics.age?.max;
    }
  }

  private sameUnordered(a: unknown[], b: unknown[]): boolean {
    return [...a].sort().join() === [...b].sort().join();
  }
}

import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  PLACE_LANGUAGES_LIST,
  SUPPORTED_LANGUAGES,
  SupportedLanguagesCode,
} from "@soliguide/common";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-display-languages-admin",
  templateUrl: "./display-languages-admin.component.html",
  styleUrls: ["./display-languages-admin.component.css"],
})
export class DisplayLanguagesAdminComponent implements OnInit, OnDestroy {
  public readonly PLACE_LANGUAGES_LIST = PLACE_LANGUAGES_LIST;
  public readonly AVAILABLE_FLAGS: string[] = SUPPORTED_LANGUAGES;

  @Input() public languages: string[];
  @Input() public edit: boolean;
  @Input() public languagesAdded: string[] = [];
  @Input() public languagesRemoved: string[] = [];

  private readonly subscription: Subscription = new Subscription();

  public faTimes = faTimes;
  public currentLang: SupportedLanguagesCode;

  public constructor(
    private readonly currentLanguageService: CurrentLanguageService
  ) {}

  public ngOnInit() {
    this.subscription.add(
      this.currentLanguageService.subscribe((lang) => {
        this.currentLang = lang;
      })
    );
  }
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public removeLang = (shortLang: string): void => {
    const indexLang = this.languages.indexOf(shortLang);
    this.languages.splice(indexLang, 1);
  };

  public flagExists = (shortLang: string): boolean => {
    return this.AVAILABLE_FLAGS.includes(shortLang);
  };
}

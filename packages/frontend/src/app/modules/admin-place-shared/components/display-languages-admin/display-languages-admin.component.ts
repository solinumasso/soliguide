import { Component, Input, OnChanges, OnInit, OnDestroy } from "@angular/core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  PLACE_LANGUAGES_LIST,
  SUPPORTED_LANGUAGES,
  SupportedLanguagesCode,
} from "@soliguide/common";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { Subscription } from "rxjs";

export interface LanguageMeta {
  lang: string;
  hasFlag: boolean;
  isAdded: boolean;
}

@Component({
  selector: "app-display-languages-admin",
  templateUrl: "./display-languages-admin.component.html",
  styleUrls: ["./display-languages-admin.component.css"],
})
export class DisplayLanguagesAdminComponent
  implements OnChanges, OnInit, OnDestroy
{
  public readonly PLACE_LANGUAGES_LIST = PLACE_LANGUAGES_LIST;
  private readonly AVAILABLE_FLAGS: string[] = SUPPORTED_LANGUAGES;

  @Input() public languages: string[];
  @Input() public edit: boolean;
  @Input() public languagesAdded: string[] = [];
  @Input() public languagesRemoved: string[] = [];

  public computedLanguages: LanguageMeta[] = [];
  public computedRemoved: LanguageMeta[] = [];

  private readonly subscription: Subscription = new Subscription();

  public faTimes = faTimes;
  public currentLang: SupportedLanguagesCode;

  public constructor(
    private readonly currentLanguageService: CurrentLanguageService
  ) {}

  public ngOnChanges(): void {
    this.compute();
  }

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
    this.compute();
  };

  private compute(): void {
    this.computedLanguages = this.languages.map((lang) => ({
      lang,
      hasFlag: this.AVAILABLE_FLAGS.includes(lang) && lang !== "lsf",
      isAdded: this.languagesAdded.includes(lang),
    }));
    this.computedRemoved = this.languagesRemoved.map((lang) => ({
      lang,
      hasFlag: this.AVAILABLE_FLAGS.includes(lang) && lang !== "lsf",
      isAdded: false,
    }));
  }
}

import { Injectable } from "@angular/core";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { ALL_LANGUAGES_CODES } from "./ALL_LANGUAGES_CODES.const";
import { PLACE_LANGUAGES_LIST } from "@soliguide/common";
import { TranslateService } from "@ngx-translate/core";
import { LanguagesArray } from "../../../../models";

@Injectable({
  providedIn: "root",
})
export class InputLanguagesService {
  private languagesArray: LanguagesArray[];

  public constructor(
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {
    this.languagesArray = [];
  }

  public getLanguagesArray() {
    const currentLanguage = this.currentLanguageService.currentLanguage;
    const availableLanguages = Object.keys(
      ALL_LANGUAGES_CODES[currentLanguage]
    );

    this.languagesArray = availableLanguages
      .reduce((acc: LanguagesArray[], lang) => {
        const shortLang = lang.replace("LANGUE_", "").toLowerCase();

        if (typeof PLACE_LANGUAGES_LIST[shortLang] !== "undefined") {
          acc.push({
            shortLang,
            name: this.translateService.instant(
              `LANGUE_${shortLang.toUpperCase()}`
            ),
            nativeName: PLACE_LANGUAGES_LIST[shortLang].nativeName,
          });
        }

        return acc;
      }, [])
      .sort((a, b) => {
        return a.name < b.name ? -1 : 1;
      });

    return this.languagesArray;
  }

  private normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
      .trim();
  }

  public searchLanguage(term: string): LanguagesArray[] {
    if (!term?.trim()) {
      return [];
    }

    const normalizedTerm = this.normalizeString(term);

    return this.languagesArray
      .filter(
        (language) =>
          this.normalizeString(language.name).includes(normalizedTerm) ||
          this.normalizeString(language.nativeName).includes(normalizedTerm)
      )
      .slice(0, 10);
  }
}

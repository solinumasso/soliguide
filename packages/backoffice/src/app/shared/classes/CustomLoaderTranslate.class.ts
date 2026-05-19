import { HttpClient } from "@angular/common/http";
import { TranslateLoader } from "@ngx-translate/core";
import { Observable } from "rxjs";

export class CustomLoaderTranslate implements TranslateLoader {
  constructor(private readonly http: HttpClient) {}

  public getTranslation(lang: string): Observable<{ [key: string]: string }> {
    return this.http.get<{ [key: string]: string }>(
      `/assets/locales/${lang}.json`
    );
  }
}

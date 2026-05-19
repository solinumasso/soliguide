import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import {
  SearchResults,
  SupportedLanguagesCode,
  TranslatedField,
  TranslatedPlace,
} from "@soliguide/common";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { SearchTranslatedFields, SearchTranslatedPlace } from "../interfaces";

import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class TranslationService {
  public endPoint = `${environment.apiUrl}/translations`;
  constructor(private readonly http: HttpClient) {}

  public searchTranslatedFields(
    search: SearchTranslatedFields
  ): Observable<SearchResults<TranslatedField>> {
    return this.http
      .post<SearchResults<TranslatedField>>(`${this.endPoint}/search`, search)
      .pipe(
        map((response: SearchResults<TranslatedField>) => {
          if (!response.nbResults) {
            return { nbResults: 0, results: [] };
          }
          return response;
        })
      );
  }

  public searchTranslatedPlace(
    search: SearchTranslatedPlace
  ): Observable<SearchResults<TranslatedPlace>> {
    return this.http
      .post<SearchResults<TranslatedPlace>>(
        `${this.endPoint}/search-places`,
        search
      )
      .pipe(
        map((response: SearchResults<TranslatedPlace>) => {
          if (!response.nbResults) {
            return { nbResults: 0, results: [] };
          }
          return response;
        })
      );
  }

  public patchTranslatedField(
    tradFieldObjectId: string,
    formValue: { content: string; lang: SupportedLanguagesCode }
  ) {
    return this.http.patch<TranslatedField>(
      `${this.endPoint}/${tradFieldObjectId}`,
      formValue
    );
  }

  public findTranslatedField(
    tradFieldObjectId: string
  ): Observable<TranslatedField> {
    return this.http.get<TranslatedField>(
      `${this.endPoint}/${tradFieldObjectId}`
    );
  }

  public isTranslator(): Observable<boolean> {
    return this.http.get<boolean>(`${this.endPoint}/is-translator`);
  }
}

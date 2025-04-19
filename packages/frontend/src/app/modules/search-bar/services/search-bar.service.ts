import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SearchAutoComplete } from "@soliguide/common";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SearchBarService {
  public ep = `${environment.apiUrl}new-search/`;

  constructor(private readonly http: HttpClient) {}

  public autoComplete(term: string): Observable<SearchAutoComplete> {
    return this.http.get<SearchAutoComplete>(
      `${this.ep}auto-complete/${encodeURI(term)}`
    );
  }
}

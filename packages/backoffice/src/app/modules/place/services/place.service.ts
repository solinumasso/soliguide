import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { ApiPlace } from "@soliguide/common";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { CurrentLanguageService } from "../../general/services/current-language.service";

import { Place } from "../../../models/place/classes";

import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PlaceService {
  constructor(
    private readonly http: HttpClient,
    private readonly currentLanguageService: CurrentLanguageService
  ) {}

  public getPlace = (seoUrl: string): Observable<Place> => {
    const apiURL = `${environment.apiUrl}/place/${seoUrl}/${this.currentLanguageService.currentLanguage}`;

    return this.http
      .get<ApiPlace>(apiURL)
      .pipe(map((place: ApiPlace) => new Place(place, false)));
  };

  // Structures modification button
  public canEditPlace = (seoUrl: string): Observable<boolean> => {
    return this.http.get<boolean>(
      `${environment.apiUrl}/admin/user-rights/can-edit/${seoUrl}`
    );
  };

  public canReadChangePlace = (changeObjectId: string): Observable<boolean> => {
    return this.http.get<boolean>(
      `${environment.apiUrl}/place-changes/can-read-change/${changeObjectId}`
    );
  };
}

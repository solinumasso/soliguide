import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { PlaceContact } from "@soliguide/common";

import { Observable } from "rxjs";

import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PlaceContactsService {
  public endPoint: string;

  constructor(private http: HttpClient) {
    this.endPoint = `${environment.apiUrl}/place-contacts`;
  }

  public getPlaceContacts(lieu_id: number): Observable<PlaceContact[]> {
    return this.http.get<PlaceContact[]>(`${this.endPoint}/${lieu_id}`);
  }
}

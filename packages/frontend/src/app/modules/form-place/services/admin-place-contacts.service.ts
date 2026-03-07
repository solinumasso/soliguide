import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { PlaceContactForAdmin } from "@soliguide/common";

import { Observable } from "rxjs";

import { UserEdit } from "../../users/types";

import { ApiMessage } from "../../../models";

import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AdminPlaceContactsService {
  public endPoint = `${environment.apiUrl}/place-contacts/`;

  constructor(public http: HttpClient) {}

  public getPlaceContactsForAdmin(
    lieu_id: number
  ): Observable<PlaceContactForAdmin[]> {
    return this.http.get<PlaceContactForAdmin[]>(
      `${this.endPoint}${lieu_id}/admin`
    );
  }

  public patchDisplayContactPro(
    roleObjectId: string,
    displayContactPro: boolean
  ): Observable<ApiMessage> {
    return this.http.patch<ApiMessage>(
      `${this.endPoint}display-contact/${roleObjectId}`,
      {
        displayContactPro,
      }
    );
  }

  public updatePlaceContact(
    userObjectId: string,
    userEditDatas: Omit<
      UserEdit,
      "mail" | "languages" | "translator" | "territories"
    >
  ): Observable<ApiMessage> {
    const endPoint = `${environment.apiUrl}/users/user-contact/`;

    return this.http.patch<ApiMessage>(
      `${endPoint}${userObjectId}`,
      userEditDatas
    );
  }
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { SearchUsersObject } from "../classes/SearchUsers.class";
import { environment } from "../../../../environments/environment";
import { ApiMessage } from "../../../models";
import { CommonUser, SearchResults } from "@soliguide/common";
import { PasswordTokenResponse } from "src/app/models/manage-search/interfaces";

@Injectable({
  providedIn: "root",
})
export class AdminUsersService {
  private endPoint = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) {}

  public searchUsers(
    search: SearchUsersObject
  ): Observable<SearchResults<CommonUser>> {
    return this.http
      .post<SearchResults<CommonUser>>(`${this.endPoint}/search`, search)
      .pipe(
        map((response: SearchResults<CommonUser>) => {
          if (response.nbResults > 0) {
            return response;
          }
          return { nbResults: 0, results: [] };
        })
      );
  }

  public deleteUser(user: CommonUser): Observable<ApiMessage> {
    return this.http.delete<ApiMessage>(`${this.endPoint}/${user._id}`);
  }

  public removeFromDev(userObjectId: string): Observable<ApiMessage> {
    return this.http.patch<ApiMessage>(`${this.endPoint}/removeFromDev`, {
      _id: userObjectId,
    });
  }

  public createDevToken(userObjectId: string): Observable<string> {
    return this.http.get<string>(
      `${this.endPoint}/createDevToken/${userObjectId}`
    );
  }

  public generateResetPasswordToken(
    userEmail: string
  ): Observable<PasswordTokenResponse> {
    return this.http.post<PasswordTokenResponse>(
      `${environment.apiUrl}/users/forgot-password`,
      { mail: userEmail, isAdminRequest: true }
    );
  }
}

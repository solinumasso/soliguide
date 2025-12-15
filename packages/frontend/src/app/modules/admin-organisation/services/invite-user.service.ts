/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { InvitationFormData } from "../types";
import { Organisation } from "../interfaces";

import { Invitation } from "../../users/classes";

import { ApiMessage } from "../../../models";

import { environment } from "../../../../environments/environment";
import { CommonUser } from "@soliguide/common";

@Injectable({
  providedIn: "root",
})
export class InviteUserService {
  private endpoint = `${environment.apiUrl}/invite-user/`;

  constructor(private http: HttpClient) {}

  public sendInvite(data: InvitationFormData): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(this.endpoint, data);
  }

  public reSendInvite(
    orga: Pick<Organisation, "_id">,
    invitation: Pick<Invitation, "token">
  ): Observable<ApiMessage> {
    return this.http.get<ApiMessage>(
      `${this.endpoint}resend/${orga._id}/${invitation.token}`
    );
  }

  public getInvitationInfos(tokenInvitation: string): Observable<Invitation> {
    return this.http.get(`${this.endpoint}infos/${tokenInvitation}`).pipe(
      map((response: Partial<Invitation>) => {
        return new Invitation(response);
      })
    );
  }

  public validateInvitation(tokenInvitation: string): Observable<CommonUser> {
    return this.http.get<CommonUser>(
      `${this.endpoint}validate/${tokenInvitation}`
    );
  }

  public deleteInvitation(tokenInvitation: string): Observable<ApiMessage> {
    return this.http.delete<ApiMessage>(`${this.endpoint}${tokenInvitation}`);
  }

  public checkEmailAlreadyUsedInOrga(
    mail: string,
    orgaId: string
  ): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.endpoint}test-email-exist-orga/${orgaId}`,
      {
        mail,
      }
    );
  }
}

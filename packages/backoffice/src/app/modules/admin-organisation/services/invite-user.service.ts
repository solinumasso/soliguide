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

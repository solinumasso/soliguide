import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Station } from "@soliguide/common";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class TransportService {
  private readonly apiUrl = `${environment.locationApiUrl}/transports`;

  constructor(private readonly http: HttpClient) {}

  public getStations(
    latitude: number,
    longitude: number,
    placeId: number
  ): Observable<Station[]> {
    const url = `${this.apiUrl}/${latitude}/${longitude}/${placeId}`;
    return this.http.get<Station[]>(url);
  }
}

import { HttpClient, HttpEvent, HttpEventType } from "@angular/common/http";
import { Injectable } from "@angular/core";

import type { ApiPlace, CommonPlaceDocument } from "@soliguide/common";

import { saveAs } from "file-saver";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Place } from "../../../models/place/classes";

import { UploadResponse } from "./../../../shared/types/UploadResponse.type";

import { environment } from "../../../../environments/environment";

export type MediaType = "photos" | "documents";

@Injectable({
  providedIn: "root",
})
export class UploadService {
  public http: HttpClient;
  public endPoint: string;

  constructor(http: HttpClient) {
    this.http = http;
    this.endPoint = environment.apiUrl;
  }

  public upload(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    placeId: number,
    media: MediaType
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Observable<any> {
    const uploadURL = `${this.endPoint}/${media}/${placeId}`;

    return this.http
      .post<UploadResponse>(uploadURL, data, {
        observe: "events",
        reportProgress: true,
      })
      .pipe(
        map((event: HttpEvent<unknown>) => {
          return this.setProgress(event);
        })
      );
  }

  public delete(
    id: string,
    placeId: number,
    media: MediaType,
    arrayId: number | null = null // utile pour les documents dans les services ou les photos dans les parcours
  ): Observable<Place> {
    let uploadURL = `${this.endPoint}/${media}/${placeId}/`;

    uploadURL += id;

    if (arrayId !== null) {
      uploadURL += "/";
      uploadURL += arrayId.toString();
    }

    return this.http.delete<ApiPlace>(uploadURL).pipe(
      map((response: ApiPlace) => {
        return new Place(response);
      })
    );
  }

  public getDocument(doc: CommonPlaceDocument): void {
    this.http
      .get(`${environment.apiUrl}/medias/documents/${doc.path}`, {
        responseType: "blob",
      })
      .subscribe({
        next: (file: Blob) => {
          this.download(doc, file);
        },
      });
  }

  public download(doc: CommonPlaceDocument, x: Blob): void {
    const newBlob = new Blob([x], { type: doc.mimetype });
    saveAs(newBlob, doc.filename);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private setProgress(event: HttpEvent<any>) {
    if (event.type === HttpEventType.UploadProgress) {
      if (event.total) {
        const progress = Math.round((100 * event.loaded) / event.total);
        return {
          message: progress,
          status: "progress",
        };
      }
    } else if (event.type === HttpEventType.Response) {
      return { success: true, body: event.body };
    }
    return `Unhandled event: ${event.type}`;
  }
}

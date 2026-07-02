import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";

import { PlaceChangesSection } from "@soliguide/common";

import { environment } from "../../../environments/environment";

export interface CrowdsourceUserContext {
  userId: number | null;
  mail: string;
  name: string;
  lastname: string;
  status: string;
  admin: boolean;
  pro: boolean;
  organizationName: string | null;
}

export interface CrowdsourcePayload {
  placeId: number;
  section: PlaceChangesSection;
  // Raw info reported by the contributor. Shape depends on `section`.
  value: unknown;
  comment: string;
  pseudo: string | null;
  user: CrowdsourceUserContext | null;
}

const STORAGE_KEY = "soliguide.crowdsource.submitted";

interface StoredEntry {
  placeId: number;
  section: PlaceChangesSection;
}

@Injectable({
  providedIn: "root",
})
export class CrowdsourceService {
  constructor(private readonly http: HttpClient) {}

  // Endpoint TBD: the backend route will fan the payload out to RabbitMQ then
  // Slack once wired.
  public submit(payload: CrowdsourcePayload): Observable<void> {
    return this.http
      .post<void>(
        `${environment.apiUrl}/crowdsource/place/${payload.placeId}`,
        payload
      )
      .pipe(tap(() => this.markSubmitted(payload.placeId, payload.section)));
  }

  public hasSubmitted(
    placeId: number,
    section: PlaceChangesSection
  ): boolean {
    return this.read().some(
      (entry) => entry.placeId === placeId && entry.section === section
    );
  }

  public markSubmitted(
    placeId: number,
    section: PlaceChangesSection
  ): void {
    const entries = this.read();
    if (
      entries.some((e) => e.placeId === placeId && e.section === section)
    ) {
      return;
    }
    entries.push({ placeId, section });
    this.write(entries);
  }

  private read(): StoredEntry[] {
    if (typeof localStorage === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as StoredEntry[]) : [];
    } catch {
      return [];
    }
  }

  private write(entries: StoredEntry[]): void {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // storage full or blocked — silently ignore
    }
  }
}

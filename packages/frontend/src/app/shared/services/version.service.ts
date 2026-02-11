/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2025 Solinum
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
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { tap, catchError } from "rxjs/operators";

interface VersionInfo {
  version: string;
}

@Injectable({
  providedIn: "root",
})
export class VersionService {
  private readonly versionSubject = new BehaviorSubject<string | null>(null);
  public version$: Observable<string | null> =
    this.versionSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  /**
   * Load version from version.json file
   * This should be called once at application startup
   */
  public loadVersion(): Observable<VersionInfo> {
    return this.http.get<VersionInfo>("/assets/version.json").pipe(
      tap((versionInfo) => {
        this.versionSubject.next(versionInfo.version);
      }),
      catchError((error) => {
        console.error("Failed to load version.json:", error);
        this.versionSubject.next("unknown");
        throw error;
      })
    );
  }

  /**
   * Get the current version (synchronous)
   */
  public getVersion(): string | null {
    return this.versionSubject.value;
  }
}

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
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, Observable, of } from "rxjs";

import { PublicHoliday } from "@soliguide/common";

import { THEME_CONFIGURATION } from "../../../models";
import { HttpClient } from "@angular/common/http";
import { format, isSameDay } from "date-fns";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class HolidaysService {
  public todayHolidays = new BehaviorSubject<PublicHoliday[] | null>(null);
  private readonly API_URL = `${environment.locationApiUrl}/holidays/${THEME_CONFIGURATION.country}`;

  constructor(private readonly http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    if (!this.todayHolidays.value) {
      const today = new Date();
      const formattedDate = format(today, "yyyy-MM-dd");
      const url = `${this.API_URL}/${formattedDate}`;

      this.http
        .get<PublicHoliday[]>(url)
        .pipe(
          tap((holidays) => this.todayHolidays.next(holidays)),
          catchError((error) => {
            console.error("Failed to fetch initial holidays:", error);
            return of([]);
          })
        )
        .subscribe();
    }
  }

  public getHolidays(date: Date): Observable<PublicHoliday[]> {
    const today = new Date();

    if (isSameDay(date, today) && this.todayHolidays.value) {
      return of(this.todayHolidays.value);
    }

    const formattedDate = format(date, "yyyy-MM-dd");
    const url = `${this.API_URL}/${formattedDate}`;

    return this.http.get<PublicHoliday[]>(url).pipe(
      tap((holidays) => {
        this.todayHolidays.next(holidays);
      }),
      catchError((error) => {
        console.error("Failed to fetch holidays:", error);
        return of([]);
      })
    );
  }

  public clearCache(): void {
    this.todayHolidays.next(null);
  }
}

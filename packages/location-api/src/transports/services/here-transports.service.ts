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
import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { catchError, firstValueFrom, map } from "rxjs";

import { ConfigService } from "@nestjs/config";
import { calculateDistanceBetweenTwoPoints, Station } from "@soliguide/common";
import { HereTransportStation } from "../interfaces/here-station.interface";
import { filterTransports } from "./filter-transports";

@Injectable()
export class HereTransportsService {
  private readonly logger = new Logger(HereTransportsService.name);

  constructor(
    private httpService: HttpService,
    public configService: ConfigService
  ) {}

  private readonly baseUrl: string = "https://transit.hereapi.com/v8/stations";

  async getTransports(latitude: number, longitude: number) {
    const params = {
      apiKey: this.configService.get<string>("HERE_API_KEY"),
      in: `${latitude},${longitude},r=2000`,
      return: "transport",
      modes:
        "-highSpeedTrain,-intercityTrain,-interRegionalTrain,-regionalTrain,-ferry,-flight,-aerial,-monorail,-privateBus",
      // Doc: https://www.here.com/docs/bundle/intermodal-routing-api-developer-guide/page/concepts/modes.html
    };

    try {
      return await firstValueFrom(
        this.httpService
          .get<{
            stations: HereTransportStation[];
          }>(this.baseUrl, { params })
          .pipe(
            map((response) => filterTransports(response.data.stations)),
            map((stations: Station[]) =>
              stations.map((station: Station) => {
                station.place.distance = calculateDistanceBetweenTwoPoints(
                  latitude,
                  longitude,
                  station.place.location.lat,
                  station.place.location.lng
                );
                return station;
              })
            ),
            catchError((error) => {
              this.logger.error("Error fetching stations:", error);
              throw new Error(
                "Failed to fetch stations. Please try again later."
              );
            })
          )
      );
    } catch (error) {
      this.logger.error("Error in getStations method:", error);
      throw error;
    }
  }
}

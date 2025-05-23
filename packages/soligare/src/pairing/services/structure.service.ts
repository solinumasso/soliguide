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
import { Injectable } from '@nestjs/common';
import {
  ApiPlace,
  PlaceType,
  PostgresStructureId,
  SoliguideCountries,
} from '@soliguide/common';
import { PostgresService } from './postgres.service';
import { InfosService } from './format/infos';
import { LanguageService } from './format/language';
import { PositionService } from './format/position';
import { ModalitiesService } from './format/modalities';
import { PublicsService } from './format/publics';
import { HoursService } from './format/hours';
import { ServiceService } from './format/service';
import { DagsterSchema } from '../../config/enums';

@Injectable()
export class StructureService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getStructureByIdSoliguideFormat(
    id: string,
  ): Promise<Partial<ApiPlace>> {
    const connection = this.postgresService.getConnection();

    const postgresId = await connection<PostgresStructureId[]>`
      SELECT *
      FROM dagster_structure.ids
      where id = ${id}
    `;

    if (!postgresId.length) {
      return {};
    }

    const infosService = new InfosService(this.postgresService);
    const languageService = new LanguageService(this.postgresService);
    const positionService = new PositionService(this.postgresService);
    const modalitiesService = new ModalitiesService(this.postgresService);
    const publicsService = new PublicsService(this.postgresService);
    const hoursService = new HoursService(this.postgresService);
    const serviceService = new ServiceService(this.postgresService);

    const infos = await infosService.getInfosByIdSoliguideFormat(id);
    const languages = await languageService.getLanguageByIdSoliguideFormat(id);
    const position = await positionService.getPositionByIdSoliguideFormat(id);
    const modalities = await modalitiesService.getModalitiesByIdSoliguideFormat(
      id,
      DagsterSchema.STRUCTURE,
    );
    const publics = await publicsService.getPublicsByIdSoliguideFormat(
      id,
      DagsterSchema.STRUCTURE,
    );
    const hours = await hoursService.getHoursByIdSoliguideFormat(
      id,
      DagsterSchema.STRUCTURE,
    );
    const services = await serviceService.getServiceByIdSoliguideFormat(id);

    const formatStructure: Partial<ApiPlace> = {
      placeType: PlaceType.PLACE,
      name: infos.name,
      description: infos.description,
      entity: infos.entity,
      languages,
      position,
      modalities: modalities,
      publics,
      newhours: hours,
      services_all: services,
      country: position.country as SoliguideCountries,
    };

    return formatStructure;
  }
}

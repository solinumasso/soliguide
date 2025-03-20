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
import { PostgresServiceId, CommonNewPlaceService } from '@soliguide/common';
import { PostgresService } from '../../postgres.service';
import { CloseService } from './close.service';
import { CategoryService } from './category.service';
import { CategorySpecificService } from './categorySpecific.service';
import { CompareService } from './compare.service';
import { SaturationService } from './saturation.service';
import { ModalitiesService } from '../modalities';
import { PublicsService } from '../publics';
import { HoursService } from '../hours';
import { DagsterSchema } from '../../../../config/enums';

export class ServiceService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getServiceByIdSoliguideFormat(
    id: string,
  ): Promise<CommonNewPlaceService[]> {
    const connection = this.postgresService.getConnection();

    const postgresService = await connection<PostgresServiceId[]>`
      SELECT *
      FROM ${connection(DagsterSchema.SERVICE)}.ids
      WHERE structure_id = ${id}
    `;

    const categoryService = new CategoryService(this.postgresService);
    const categorySpecificService = new CategorySpecificService(
      this.postgresService,
    );
    const closeService = new CloseService(this.postgresService);
    const compareService = new CompareService(this.postgresService);
    const saturationService = new SaturationService(this.postgresService);
    const modalitiesService = new ModalitiesService(this.postgresService);
    const publicsService = new PublicsService(this.postgresService);
    const hoursService = new HoursService(this.postgresService);

    const formatServices: CommonNewPlaceService[] = await Promise.all(
      postgresService.map(async (service: PostgresServiceId) => {
        const category = await categoryService.getCategoryByIdSoliguideFormat(
          service.id,
        );
        const categorySpecific =
          await categorySpecificService.getCategorySpecificByIdSoliguideFormat(
            service.id,
          );
        const close = await closeService.getCloseByIdSoliguideFormat(
          service.id,
        );
        const compare = await compareService.getCompareByIdSoliguideFormat(
          service.id,
        );
        const saturation =
          await saturationService.getSaturationByIdSoliguideFormat(service.id);
        const modalities =
          await modalitiesService.getModalitiesByIdSoliguideFormat(
            service.id,
            DagsterSchema.SERVICE,
          );
        const publics = await publicsService.getPublicsByIdSoliguideFormat(
          service.id,
          DagsterSchema.SERVICE,
        );
        const hours = await hoursService.getHoursByIdSoliguideFormat(
          service.id,
          DagsterSchema.SERVICE,
        );

        const preFormatService: Partial<CommonNewPlaceService> = {
          close: close.close!,
          category: category.category,
          categorySpecificFields: categorySpecific,
          description: category.description!,
          name: category.name,
          differentHours: compare.differentHours!,
          differentPublics: compare.differentPublics!,
          differentModalities: compare.differentModalities!,
          saturated: saturation.saturated,
          modalities,
          publics,
          hours,
        };

        return new CommonNewPlaceService(preFormatService);
      }),
    );
    return formatServices;
  }
}

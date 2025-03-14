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
import {
  AvailableEquipmentType,
  BabyParcelAgeType,
  DietaryAdaptationsType,
  FoodProductType,
  ServiceStyleType,
  CategoriesSpecificFields,
  PostgresServiceCategorySpecific,
} from '@soliguide/common';
import { PostgresService } from '../../postgres.service';

export class CategorySpecificService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getCategorySpecificByIdSoliguideFormat(
    id: string,
  ): Promise<CategoriesSpecificFields> {
    const connection = this.postgresService.getConnection();

    const postgresServiceCategorySpecific = await connection<
      PostgresServiceCategorySpecific[]
    >`
      SELECT *
      FROM dagster_service.category_specific
      where id = ${id}
    `;

    const formatCategorySpecificFields: CategoriesSpecificFields = {
      availableEquipmentType: [],
      babyParcelAgeType: [],
      foodProductType: [],
      serviceStyleType: [],
      dietaryAdaptationsType: [],
    };

    postgresServiceCategorySpecific.forEach(
      (categorySpecific: PostgresServiceCategorySpecific) => {
        switch (categorySpecific.specific) {
          case 'availableEquipmentType': {
            formatCategorySpecificFields.availableEquipmentType?.push(
              categorySpecific.value as AvailableEquipmentType,
            );
            break;
          }
          case 'babyParcelAgeType': {
            formatCategorySpecificFields.babyParcelAgeType?.push(
              categorySpecific.value as BabyParcelAgeType,
            );
            break;
          }
          case 'foodProductType': {
            formatCategorySpecificFields.foodProductType?.push(
              categorySpecific.value as FoodProductType,
            );
            break;
          }
          case 'serviceStyleType': {
            formatCategorySpecificFields.serviceStyleType?.push(
              categorySpecific.value as ServiceStyleType,
            );
            break;
          }
          case 'dietaryAdaptationsType': {
            formatCategorySpecificFields.dietaryAdaptationsType?.push(
              categorySpecific.value as DietaryAdaptationsType,
            );
            break;
          }
          default: {
            Object.assign(formatCategorySpecificFields, {
              [categorySpecific.specific]: categorySpecific.value,
            });
            break;
          }
        }
      },
    );

    function checkLength<T, K extends keyof T>(obj: T, key: K) {
      if (Array.isArray(obj[key])) {
        return obj[key].length;
      }
      return 1;
    }

    function deleteProperty<T, K extends keyof T>(obj: T, key: K) {
      delete obj[key];
    }

    [
      'availableEquipmentType',
      'babyParcelAgeType',
      'foodProductType',
      'serviceStyleType',
      'dietaryAdaptationsType',
    ].forEach((key) => {
      if (
        !checkLength(
          formatCategorySpecificFields,
          key as keyof CategoriesSpecificFields,
        )
      ) {
        deleteProperty(
          formatCategorySpecificFields,
          key as keyof CategoriesSpecificFields,
        );
      }
    });

    return formatCategorySpecificFields;
  }
}

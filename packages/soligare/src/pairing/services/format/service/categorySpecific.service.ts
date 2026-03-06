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

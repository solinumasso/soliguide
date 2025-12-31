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
export enum ServiceTranslatedFieldElement {
  SERVICE_DESCRIPTION = "service.description",
  SERVICE_MODALITIES_APPOINTMENT_PRECISIONS = "service.modalities.appointment.precisions",
  SERVICE_MODALITIES_INSCRIPTION_PRECISIONS = "service.modalities.inscription.precisions",
  SERVICE_MODALITIES_ORIENTATION_PRECISIONS = "service.modalities.orientation.precisions",
  SERVICE_MODALITIES_OTHER = "service.modalities.other",
  SERVICE_MODALITIES_PRICE_PRECISIONS = "service.modalities.price.precisions",
  SERVICE_PUBLICS_DESCRIPTION = "service.publics.description",
  SERVICE_SATURATED_PRECISION = "service.saturated.precision",
  SERVICE_SPECIFIC_FIELD_ACTIVITY_NAME = "service.categorySpecificFields.activityName",
  SERVICE_SPECIFIC_FIELD_AVAILABLE_EQUIPMENT_PRECISIONS = "service.categorySpecificFields.availableEquipmentPrecisions",
  SERVICE_SPECIFIC_FIELD_JOBSLIST = "service.categorySpecificFields.jobsList",
  SERVICE_SPECIFIC_FIELD_USAGE_MODALITY = "service.categorySpecificFields.usageModality",
  SERVICE_SPECIFIC_FIELD_VOUCHER_TYPE_PRECISIONS = "service.categorySpecificFields.voucherTypePrecisions",
  SERVICE_SPECIFIC_FIELD_OTHER_PRODUCT_TYPE_PRECISIONS = "service.categorySpecificFields.otherProductTypePrecisions",
  SERVICE_SPECIFIC_FIELD_WELLNESS_ACTIVITY_NAME = "service.categorySpecificFields.wellnessActivityName",
  // [CATEGORY] Old category to remove
  SERVICE_JOBSLIST = "service.jobsList",
}

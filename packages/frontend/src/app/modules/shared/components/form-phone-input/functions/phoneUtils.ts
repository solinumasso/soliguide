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
import { Phone, phoneUtil } from "@soliguide/common";
import { ChangeData, CountryISO } from "ngx-intl-tel-input";
import { THEME_CONFIGURATION } from "../../../../../models";

export function getFormPhone(
  formValue: ChangeData
): Pick<Phone, "phoneNumber" | "countryCode"> {
  return {
    phoneNumber: formValue?.nationalNumber
      ? formValue?.nationalNumber.replace(/\s/g, "")
      : null,
    countryCode: formValue?.countryCode
      ? (formValue?.countryCode.toLowerCase() as CountryISO)
      : THEME_CONFIGURATION.country,
  };
}

export function setFormPhone(
  phone: Pick<Phone, "phoneNumber" | "countryCode">
): ChangeData {
  const defaultReturn = {
    number: "",
    countryCode: THEME_CONFIGURATION.country,
  };
  try {
    const parsedPhone = phoneUtil.parse(phone.phoneNumber, phone.countryCode);

    if (!phoneUtil.isValidNumber(parsedPhone) || !parsedPhone) {
      return defaultReturn;
    }
    return {
      number: parsedPhone.getNationalNumber().toString(),
      countryCode: phone.countryCode,
    };
  } catch (e) {
    return defaultReturn;
  }
}

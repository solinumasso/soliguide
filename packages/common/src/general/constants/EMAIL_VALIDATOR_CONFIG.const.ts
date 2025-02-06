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
import { IsEmailOptions } from "validator/lib/isEmail";

// Default values from documentation : https://github.com/validatorjs/validator.js/blob/master/README.md#:~:text=email.%0A%0Aoptions%20is%20an-,object,-which%20defaults%20to%20%7B%20allow_display_name
export const EMAIL_VALIDATOR_CONFIG: IsEmailOptions = {
  allow_display_name: false,
  require_display_name: false,
  allow_utf8_local_part: false,
  require_tld: true,
  allow_ip_domain: false,
  domain_specific_validation: false,
  blacklisted_chars: "",
};

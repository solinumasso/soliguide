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
  TranslatedFieldElement,
  TranslatedFieldStatus,
} from "@soliguide/common";

import { ManageSearch } from "../../../models/manage-search/classes/ManageSearch.class";
import { User } from "../../users/classes";

export class SearchTranslatedFields extends ManageSearch {
  public createdAt?: Date;
  public elementName?: TranslatedFieldElement;
  public lieu_id?: string;
  public status?: TranslatedFieldStatus;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(data: any, user: User) {
    super(data, user);
    this.createdAt = data?.createdAt ?? null;
    this.status = data?.status ?? null;
    this.elementName = data?.elementName ?? null;
    this.lieu_id = typeof data?.lieu_id === "number" ? data.lieu_id : null;
  }
}

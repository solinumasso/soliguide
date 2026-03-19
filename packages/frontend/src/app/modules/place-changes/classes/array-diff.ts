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

export function computeArrayDiff<T>(
  oldArray: T[],
  newArray: T[],
  keyFn: (item: T) => unknown = (item) => item
): { added: T[]; removed: T[] } {
  const oldSet = new Set(oldArray.map(keyFn));
  const newSet = new Set(newArray.map(keyFn));
  return {
    added: newArray.filter((item) => !oldSet.has(keyFn(item))),
    removed: oldArray.filter((item) => !newSet.has(keyFn(item))),
  };
}

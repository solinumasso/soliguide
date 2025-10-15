/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2025 Solinum
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
// 1 day = 24 hours * 60 minutes * 60 seconds * 1000 ms
const DAY_IN_MS = 24 * 60 * 60 * 1000;

// 1 month = 30 days * 24 hours * 60 minutes * 60 seconds * 1000 ms
export const MONTH_30_IN_MS = 30 * DAY_IN_MS;

// 3 months = 3 * 30 days * 24 hours * 60 minutes * 60 seconds * 1000 ms
export const THREE_MONTHS_IN_MS = 3 * MONTH_30_IN_MS;

// 6 months = 6 * 30 days * 24 hours * 60 minutes * 60 seconds * 1000 ms
export const SIX_MONTHS_IN_MS = 6 * MONTH_30_IN_MS;

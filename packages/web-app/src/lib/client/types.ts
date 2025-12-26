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
import type { Readable, Writable } from 'svelte/store';
import type { i18n } from 'i18next';

export type I18nStore = Writable<i18n>;
export type Routes =
  | 'ROUTE_LANGUAGES'
  | 'ROUTE_HOME'
  | 'ROUTE_ONBOARDING'
  | 'ROUTE_SEARCH'
  | 'ROUTE_PLACES'
  | 'ROUTE_MORE_OPTIONS'
  | 'ROUTE_TALK'
  | 'ROUTE_FAVORITES';

export type Routing = Record<Routes, string>;
export type RoutingStore = Readable<Record<Routes, string>>;
export type CookieConsentStore = Writable<boolean>;
export type Fetcher<T> = (url: string, options?: RequestInit) => Promise<T>;
export type Fetch<T> = (input: RequestInfo | URL, init?: RequestInit) => Promise<T>;

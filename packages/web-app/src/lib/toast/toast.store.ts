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
import { get, writable } from 'svelte/store';
import type { I18nStore } from '$lib/client/types';
import type { types as DSTypes } from '@soliguide/design-system';

export interface ToastNotification {
  id: number;
  description: string;
  variant: DSTypes.ToastVariant;
  withIcon?: boolean;
  dismissible?: boolean;
  autoDismiss?: boolean;
  showLoader?: boolean;
  loaderDuration?: number | null;
}

const toastStore = writable<ToastNotification[]>([]);

export const showToast = (
  toast: Omit<ToastNotification, 'id'>,
  replaceCurrent = false
): number => {
  const defaults: Omit<ToastNotification, 'id' | 'description' | 'variant'> = {
    withIcon: true,
    dismissible: true,
    autoDismiss: true,
    showLoader: true,
    loaderDuration: null
  };

  const toastWithDefaults: ToastNotification = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    ...defaults,
    ...toast
  };

  toastStore.update((items) =>
    replaceCurrent ? [toastWithDefaults] : [...items, toastWithDefaults]
  );

  return toastWithDefaults.id;
};

export const removeToast = (id: number): void => {
  toastStore.update((items) => items.filter((item) => item.id !== id));
};

export const toasts = {
  subscribe: toastStore.subscribe
};

export const notifyFavoriteChange = (
  status: 'added' | 'removed',
  i18nStore: I18nStore
): void => {
  const i18n = get(i18nStore);
  const isAdded = status === 'added';

  showToast({
    description: i18n.t(isAdded ? 'FAVORITES_TOAST_ADDED' : 'FAVORITES_TOAST_REMOVED'),
    variant: isAdded ? 'success' : 'warning'
  });
};

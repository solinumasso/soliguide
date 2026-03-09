import { goto } from '$app/navigation';
import { derived, get, writable } from 'svelte/store';
import type { I18nStore } from '$lib/client/types';
import { type FavoriteToggleStatus } from '$lib/client/favorites';
import { generateId, type types as DSTypes } from '@soliguide/design-system';
import { getRoutes } from '$lib/client/routing';

export interface ToastNotification {
  id: string;
  description: string;
  variant: DSTypes.ToastVariant;
  withIcon?: boolean;
  dismissible?: boolean;
  autoDismiss?: boolean;
  showLoader?: boolean;
  loaderDuration?: number | null;
  withButton?: boolean;
  withButtonLink?: boolean;
  buttonLabel?: string;
  buttonLinkLabel?: string;
  buttonLinkHref?: string;
  buttonAction?: () => void;
}

interface ToastState {
  items: ToastNotification[];
  renderKey: number;
}

const toastState = writable<ToastState>({ items: [], renderKey: 0 });

export const showToast = (toast: Omit<ToastNotification, 'id'>, replaceCurrent = false): string => {
  const defaults: Omit<ToastNotification, 'id' | 'description' | 'variant'> = {
    withIcon: true,
    dismissible: true,
    autoDismiss: true,
    showLoader: true,
    loaderDuration: null,
    withButton: false,
    withButtonLink: false,
    buttonLabel: '',
    buttonLinkLabel: '',
    buttonLinkHref: ''
  };

  const toastWithDefaults: ToastNotification = {
    id: generateId(),
    ...defaults,
    ...toast
  };

  if (replaceCurrent) {
    toastState.update((state) => ({
      items: [toastWithDefaults],
      renderKey: state.renderKey + 1
    }));

    return toastWithDefaults.id;
  }

  toastState.update((state) => ({
    items: [...state.items, toastWithDefaults],
    renderKey: state.renderKey
  }));

  return toastWithDefaults.id;
};

export const removeToast = (id: string): void => {
  toastState.update((state) => ({
    items: state.items.filter((item) => item.id !== id),
    renderKey: state.renderKey
  }));
};

export const toasts = derived(toastState, ($state) => $state.items);

export const toastRenderKey = derived(toastState, ($state) => $state.renderKey);

export const notifyFavoriteChange = (status: FavoriteToggleStatus, i18nStore: I18nStore): void => {
  const i18n = get(i18nStore);
  const isAdded = status === 'added';
  const isLimitReached = status === 'limitReached';

  if (isLimitReached) {
    const routes = getRoutes(i18n.language);
    showToast(
      {
        description: i18n.t('FAVORITES_TOAST_LIMIT_REACHED'),
        variant: 'error',
        autoDismiss: true,
        showLoader: true,
        loaderDuration: 6000,
        withButton: true,
        buttonLabel: i18n.t('FAVORITES_TOAST_LIMIT_ACTION'),
        buttonAction: () => {
          goto(routes.ROUTE_FAVORITES);
        }
      },
      true
    );
    return;
  }

  showToast(
    {
      description: i18n.t(isAdded ? 'FAVORITES_TOAST_ADDED' : 'FAVORITES_TOAST_REMOVED'),
      variant: isAdded ? 'success' : 'warning'
    },
    true
  );
};

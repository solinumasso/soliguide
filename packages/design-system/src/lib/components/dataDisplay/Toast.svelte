<!--
Soliguide: Useful information for those who need it

SPDX-FileCopyrightText: © 2024 Solinum

SPDX-License-Identifier: AGPL-3.0-only

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->
<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import Text from '$lib/components/Text.svelte';
  import Close from 'svelte-google-materialdesign-icons/Close.svelte';
  import InfoIcon from '$lib/components/InfoIcon.svelte';
  import Button from '$lib/components/buttons/Button.svelte';
  import DOMPurify from 'dompurify';
  import i18n from '$lib/i18n';
  import type { ToastVariant } from '$lib/types/Toast';
  import type { InfoIconVariant } from '$lib/types/InfoIcon';

  const variantToInfoIcon: Record<ToastVariant, InfoIconVariant> = {
    info: 'info',
    success: 'success',
    warning: 'warning',
    error: 'error'
  };

  export let variant: ToastVariant = 'info';
  export let withIcon = true;
  export let description: string;
  export let dismissible = true;
  export let autoDismiss = true;
  export let showLoader = true;
  export let loaderDuration: number | null = null;

  const dispatch = createEventDispatcher<{ close: void }>();

  let toastClass: string;
  let iconVariant: InfoIconVariant;
  $: toastClass = `toast toast-${variant}`;
  $: iconVariant = variantToInfoIcon[variant];

  const close = () => {
    dispatch('close');
  };

  let dismissTimer: ReturnType<typeof setTimeout> | null = null;

  const BASE_DURATION = 2000;
  const PER_CHARACTER_DURATION = 40;
  const MIN_DURATION = 1500;
  const MAX_DURATION = 6000;

  const computeDuration = (text: string | undefined | null) => {
    const length = text?.length ?? 0;
    const raw = BASE_DURATION + length * PER_CHARACTER_DURATION;
    return Math.min(MAX_DURATION, Math.max(MIN_DURATION, raw));
  };

  $: resolvedLoaderDuration = loaderDuration ?? computeDuration(description);

  const clearDismissTimer = () => {
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      dismissTimer = null;
    }
  };

  $: {
    clearDismissTimer();
    if (autoDismiss) {
      dismissTimer = setTimeout(() => {
        close();
      }, resolvedLoaderDuration);
    }
  }

  onDestroy(clearDismissTimer);

  $: shouldShowLoader = showLoader && autoDismiss;
</script>

<article class={toastClass} role="status" aria-live="polite" aria-atomic="true">
  <div class="toast-main">
    {#if withIcon}
      <div class="toast-left-panel" aria-hidden="true">
        <InfoIcon variant={iconVariant} size="medium" />
      </div>
    {/if}

    <div class="toast-column-container">
      <div class="toast-description">
        <Text type="caption1" as="p">
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html DOMPurify.sanitize(description)}
        </Text>
      </div>
    </div>

    {#if dismissible}
      <div class="toast-close">
        <Button
          type="shy"
          size="xsmall"
          iconPosition="iconOnly"
          aria-label={$i18n.t('CLOSE')}
          title={$i18n.t('CLOSE')}
          on:click={close}
        >
          <Close slot="icon" />
        </Button>
      </div>
    {/if}
  </div>

  {#if shouldShowLoader}
    <div
      class={`toast-loader toast-loader-${iconVariant.toLowerCase()}`}
      style={`animation-duration: ${resolvedLoaderDuration}ms;`}
      aria-hidden="true"
    />
  {/if}
</article>

<style lang="scss">
  .toast {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border-radius: var(--radiusMiddle);
    gap: 0;
    overflow: hidden;
    width: 350px;
    max-width: calc(100vw - 2 * var(--spacingSM));
  }

  .toast-column-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing3XS);
    flex: 1 1 auto;
  }

  .toast-main {
    display: flex;
    align-items: center;
    gap: var(--spacingXS);
    width: 100%;
    padding: var(--spacingSM) var(--spacingSM) var(--spacingXS);
  }

  .toast-left-panel {
    display: flex;
    padding: var(--spacing3XS);
    align-items: center;
  }

  .toast-close {
    display: flex;
    padding: var(--spacing3XS);
    align-items: flex-start;
    margin-left: auto;
  }

  .toast-loader {
    width: 100%;
    height: 3px;
    margin-top: 0;
    border-radius: 0 0 0 var(--radiusMiddle);
    animation-name: toast-loader-shrink;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }

  .toast-loader-info {
    background-color: var(--color-textHighlightSecondary);
  }

  .toast-loader-success {
    background-color: var(--color-textSuccess);
  }

  .toast-loader-warning {
    background-color: var(--color-textWarning);
  }

  .toast-loader-error {
    background-color: var(--color-textError);
  }

  @keyframes toast-loader-shrink {
    from {
      transform: scaleX(1);
      transform-origin: left;
      opacity: 1;
    }

    to {
      transform: scaleX(0);
      transform-origin: left;
      opacity: 0;
    }
  }

  .toast.toast-info {
    background-color: var(--color-surfaceTertiary2);
  }
  .toast.toast-success {
    background-color: var(--color-surfaceSuccess2);
  }
  .toast.toast-warning {
    background-color: var(--color-surfaceWarning2);
  }
  .toast.toast-error {
    background-color: var(--color-surfaceError2);
  }
</style>

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
  import { getContext, onMount, tick } from 'svelte';
  import { scale } from 'svelte/transition';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import type { I18nStore } from '$lib/client/types';
  import { Text, IconFavoriteOn } from '@soliguide/design-system';
  import { getStorageItem, setStorageItem } from '$lib/client/storage';
  import Close from 'svelte-google-materialdesign-icons/Close.svelte';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  let showModal = false;
  let dialogElement: HTMLDialogElement;

  const STORAGE_KEY = 'FAVORITES_ANNOUNCEMENT_DISMISSED';

  onMount(async () => {
    const isDismissed = getStorageItem(STORAGE_KEY);
    if (!isDismissed) {
      showModal = true;
      await tick();
      dialogElement?.showModal();
    }
  });

  const handleDismiss = () => {
    setStorageItem(STORAGE_KEY, 'true');
    dialogElement?.close();
    showModal = false;
  };

  const handleBackdropClick = (event: MouseEvent) => {
    if (event.target === dialogElement) {
      handleDismiss();
    }
  };
</script>

{#if showModal}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <dialog bind:this={dialogElement} on:click={handleBackdropClick} in:scale={{ start: 0.9 }}>
    <div class="modal-content">
      <button
        type="button"
        class="close-button"
        on:click={handleDismiss}
        aria-label={$i18n.t('CLOSE')}
      >
        <Close size="24" />
      </button>

      <div class="stars star-top-left" aria-hidden="true">✦</div>
      <div class="stars star-top-right" aria-hidden="true">★</div>
      <div class="stars star-left" aria-hidden="true">✦</div>

      <div class="badge">
        <span class="sparkle" aria-hidden="true">✨</span>
        <Text type="title4PrimaryExtraBold">
          <span class="description">{$i18n.t('NEW')}</span>
        </Text>
      </div>

      <div class="icon-container">
        <span class="heart-icon">
          <IconFavoriteOn size={48} color="#FFFFFF" />
        </span>
      </div>

      <Text as="h2" type="title2PrimaryExtraBold">
        <span class="title">
          {#each $i18n.t('FAVORITES_ANNOUNCEMENT_TITLE').split('**') as part, i}
            {#if i % 2 === 1}<em>{part}</em>{:else}{part}{/if}
          {/each}
        </span>
      </Text>

      <Text type="text1">
        <span class="description">{$i18n.t('FAVORITES_ANNOUNCEMENT_TEXT')}</span>
      </Text>
    </div>
  </dialog>
{/if}

<style lang="scss">
  dialog {
    border-radius: var(--radiusRounded);
    border: none;
    padding: 0;
    max-width: 320px;
    overflow: visible;

    &::backdrop {
      background: var(--color-overlayStrong);
    }
  }

  dialog[open] {
    background-color: var(--color-surfaceWhite);
  }

  .modal-content {
    position: relative;
    padding: var(--spacing3XL) var(--spacingXL) var(--spacingXL);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--spacingMD);
  }

  .close-button {
    position: absolute;
    top: var(--spacingSM);
    right: var(--spacingSM);
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--spacingXS);
    color: var(--color-contentSecondary);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radiusRound);

    &:hover {
      background-color: var(--color-surfaceSecondary);
    }
  }

  .stars {
    position: absolute;
    color: #f4c542;
    font-size: 16px;
  }

  .star-top-left {
    top: 24px;
    left: 24px;
  }

  .star-top-right {
    top: 20px;
    right: 48px;
  }

  .star-left {
    top: 80px;
    left: 16px;
  }

  .badge {
    background: var(--color-gradientPrimary);
    color: var(--color-textInverse);
    padding: var(--spacingXS) var(--spacingMD);
    border-radius: var(--radiusFull);
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: var(--spacingXS);

    .sparkle {
      font-size: 14px;
    }
  }

  .icon-container {
    width: 80px;
    height: 80px;
    background: var(--color-gradientPrimary);
    border-radius: var(--radiusRounded);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pulse-ring 2s ease-out infinite;
  }

  .heart-icon {
    display: flex;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    animation: pulse-heart 2s ease-out infinite;
  }

  @keyframes pulse-ring {
    0% {
      box-shadow: 0 0 0 0 rgba(233, 77, 45, 0.4);
    }
    70% {
      box-shadow: 0 0 0 14px rgba(233, 77, 45, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(233, 77, 45, 0);
    }
  }

  @keyframes pulse-heart {
    0% {
      transform: scale(1);
    }
    15% {
      transform: scale(1.15);
    }
    30% {
      transform: scale(1);
    }
    100% {
      transform: scale(1);
    }
  }

  .title {
    display: block;

    :global(em) {
      color: var(--color-textHighlightPrimary);
      font-style: normal;
    }
  }

  .description {
    color: var(--color-contentSecondary);
  }
</style>

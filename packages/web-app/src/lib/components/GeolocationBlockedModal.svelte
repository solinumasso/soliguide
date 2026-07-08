<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte';
  import { scale } from 'svelte/transition';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import type { I18nStore } from '$lib/client/types';
  import { Text, Button } from '@soliguide/design-system';
  import Close from 'svelte-google-materialdesign-icons/Close.svelte';
  import LocationDisabled from 'svelte-google-materialdesign-icons/Location_disabled.svelte';

  export let open = false;
  export let brandName = '';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const dispatch = createEventDispatcher<{ retry: null; close: null }>();

  let dialogElement: HTMLDialogElement | null = null;

  const openAsModal = (node: HTMLDialogElement) => {
    node.showModal();
  };

  const handleClose = () => dispatch('close');
  const handleRetry = () => dispatch('retry');

  const handleBackdropClick = (event: MouseEvent) => {
    if (event.target === dialogElement) {
      handleClose();
    }
  };
</script>

{#if open}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <dialog
    bind:this={dialogElement}
    use:openAsModal
    on:click={handleBackdropClick}
    on:close={handleClose}
    in:scale={{ start: 0.9 }}
  >
    <div class="modal-content">
      <button
        type="button"
        class="close-button"
        on:click={handleClose}
        aria-label={$i18n.t('CLOSE')}
      >
        <Close size="24" />
      </button>

      <div class="icon-container">
        <span class="location-icon">
          <LocationDisabled size="48" color="#FFFFFF" />
        </span>
      </div>

      <Text as="h2" type="title2PrimaryExtraBold">
        <span class="title">{$i18n.t('GEOLOCATION_BLOCKED_TITLE')}</span>
      </Text>

      <Text type="text1">
        <span class="description">{$i18n.t('GEOLOCATION_BLOCKED_MESSAGE', { brandName })}</span>
      </Text>

      <div class="actions">
        <Button type="primaryFill" block on:click={handleRetry}>
          {$i18n.t('TRY_AGAIN')}
        </Button>
      </div>
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

  .icon-container {
    width: 80px;
    height: 80px;
    background: var(--color-gradientPrimary);
    border-radius: var(--radiusRounded);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .location-icon {
    display: flex;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  .title {
    display: block;
  }

  .description {
    color: var(--color-contentSecondary);
  }

  .actions {
    width: 100%;
    margin-top: var(--spacingSM);
  }
</style>

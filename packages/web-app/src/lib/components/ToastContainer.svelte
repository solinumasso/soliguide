<script lang="ts">
  import { Toast } from '@soliguide/design-system';
  import { fly } from 'svelte/transition';
  import { removeToast, toastRenderKey, toasts } from '$lib/toast/toast.store';

  const createVerticalFlyConfig = (offset: number) => ({
    duration: 200,
    // eslint-disable-next-line id-length
    y: offset
  });

  const toastEnterTransition = createVerticalFlyConfig(20);
  const toastLeaveTransition = createVerticalFlyConfig(-20);
</script>

<div class="toast-container">
  {#key $toastRenderKey}
    {#each $toasts as toast (toast.id)}
      {@const {
        id,
        variant,
        description,
        withIcon,
        dismissible,
        autoDismiss,
        showLoader,
        loaderDuration,
        withButton,
        withButtonLink,
        buttonLabel,
        buttonLinkLabel,
        buttonLinkHref,
        buttonAction: toastButtonAction
      } = toast}
      <div class="toast-wrapper" in:fly={toastEnterTransition} out:fly={toastLeaveTransition}>
        <Toast
          {variant}
          {description}
          {withIcon}
          {dismissible}
          {autoDismiss}
          {showLoader}
          {loaderDuration}
          {withButton}
          {withButtonLink}
          buttonLabel={buttonLabel ?? ''}
          buttonLinkLabel={buttonLinkLabel ?? ''}
          buttonLinkHref={buttonLinkHref ?? ''}
          buttonAction={() => {
            toastButtonAction?.();
            removeToast(id);
          }}
          on:close={() => removeToast(id)}
        />
      </div>
    {/each}
  {/key}
</div>

<style lang="scss">
  .toast-container {
    position: fixed;
    bottom: calc(var(--spacingLG) + var(--menu-height, 0px));
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    gap: var(--spacingXS);
    z-index: 1000;
  }

  @media screen and (max-width: 768px) {
    .toast-container {
      left: 50%;
      right: auto;
      transform: translateX(-50%);
      bottom: calc(var(--spacingSM) + var(--menu-height, 0px));
      align-items: center;
    }
  }

  .toast-wrapper {
    display: flex;
  }
</style>

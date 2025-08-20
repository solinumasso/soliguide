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
  import { createEventDispatcher, onMount } from 'svelte';
  import { scale } from 'svelte/transition';
  import type { MouseEventHandler } from 'svelte/elements';
  import Close from 'svelte-google-materialdesign-icons/Close.svelte';
  import Button from '$lib/components/buttons/Button.svelte';
  import Text from '$lib/components/Text.svelte';
  import type { ModalSize } from '$lib/types/Modal';
  import type { TextType } from '$lib/types/Text';

  export let backdropClick = true;
  export let title = '';
  export let size: ModalSize = 'small';

  const dispatch = createEventDispatcher<{ close: null }>();

  /** @type {?HTMLDialogElement} */
  let modalInstance: HTMLDialogElement | null = null;

  const stylesMapping: Record<ModalSize, { text: TextType; className: string }> = {
    small: { text: 'title3PrimaryExtraBold', className: 'modal-small' },
    medium: { text: 'title1PrimaryExtraBold', className: 'modal-medium' },
    large: { text: 'title1PrimaryExtraBold', className: 'modal-large' }
  };

  $: titleTextType = stylesMapping[size]?.text ?? 'title3PrimaryExtraBold';
  $: modalSizeClass = stylesMapping[size]?.className ?? 'modal-small';

  const clickBackdrop: MouseEventHandler<HTMLDialogElement> = (event) => {
    if (event.target === modalInstance && backdropClick) {
      dispatch('close');
    }
  };

  onMount(() => {
    if (modalInstance) {
      modalInstance.showModal();
    }
  });
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
  bind:this={modalInstance}
  on:close
  on:click={clickBackdrop}
  class={modalSizeClass}
  in:scale={{ start: 0.9 }}
>
  <div class="modal-content">
    <header>
      <Text type={titleTextType}><span>{title}</span></Text>
      <Button type="shy" iconPosition="iconOnly" size="small" on:click={() => dispatch('close')}>
        <Close slot="icon" />
      </Button>
    </header>

    <div class="modal-body">
      <slot />
    </div>

    {#if $$slots.footer}
      <footer>
        <slot name="footer" />
      </footer>
    {/if}
  </div>
</dialog>

<style>
  /* dialog {
    border-radius: var(--radiusRounded);
    border: none;
    padding: 0;

    &::backdrop {
      background: var(--color-overlayStrong);
    }
  }

  dialog[open] {
    background-color: var(--color-surfaceWhite);
  }
  .modal-content {
    border-radius: var(--radiusRounded);
    display: flex;
    flex-direction: column;
    gap: var(--spacingLG);
    width: 100%;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacingXS);

    span {
      overflow-wrap: anywhere;
    }
  }

  footer {
    display: flex;
    padding-top: var(--spacingLG);
  }

  .modal-small {
    max-width: 340px;
    .modal-content {
      padding: var(--spacingXL);
    }
    footer {
      flex-direction: column-reverse;
      gap: var(--spacingSM);
    }
  }

  .modal-medium {
    max-width: 600px;
  }

  .modal-large {
    max-width: 900px;
  }

  .modal-medium,
  .modal-large {
    .modal-content {
      padding: var(--spacing2XL);
    }

    footer {
      gap: var(--spacingXS);
      justify-content: flex-end;
    }
  } */
</style>

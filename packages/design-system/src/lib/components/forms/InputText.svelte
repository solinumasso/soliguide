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
  import { createEventDispatcher, type SvelteComponent, type ComponentType } from 'svelte';
  import i18n from '$lib/i18n';
  import Button from '../buttons/Button.svelte';
  import Close from 'svelte-google-materialdesign-icons/Close.svelte';
  import type { InputState } from '$lib/types/Input';

  export let value = '';
  export let name: string;
  export let placeholder = '';
  export let disabled = false;
  export let readonly = false;
  export let icon: ComponentType<SvelteComponent> | null = null;
  export let state: InputState | null = null;
  export let width = '200px';
  export let record = 'false';

  const dispatch = createEventDispatcher<{
    clear: null;
  }>();

  const reset = () => {
    value = '';
    dispatch('clear');
  };
</script>

<div
  class="input-wrapper"
  class:disabled
  class:readonly
  class:error={state === 'error'}
  class:success={state === 'success'}
  class:completed={!!value}
  style:width
>
  <input
    {readonly}
    {disabled}
    {placeholder}
    id={name}
    {name}
    type="text"
    data-record={record}
    bind:value
    on:change
    on:input
    on:blur
    on:focus
    {...$$restProps}
  />
  <span class="icons">
    {#if value && !readonly && !disabled}
      <Button
        on:click={reset}
        size="xsmall"
        type="neutralOutlined"
        iconPosition="iconOnly"
        aria-label={$i18n.t('CLEAR')}
      >
        <Close slot="icon" />
      </Button>
    {/if}
    {#if !!icon}
      <svelte:component this={icon} class="input-icon" />
    {/if}
  </span>
</div>

<style lang="scss">
  @import '../../styles/typography.scss';

  .input-wrapper {
    height: 52px;
    background: var(--color-surfaceGray3);
    border: 1px solid;
    border-color: var(--color-borderNeutral);
    border-radius: var(--radiusRounded);
    padding: 1px var(--spacingLG);
    display: flex;
    align-items: center;
    justify-content: space-between;

    &.completed {
      border-color: var(--color-borderCompleted);
    }

    &:hover {
      background-color: var(--color-surfaceTertiary2);
    }

    &:active {
      background-color: var(--color-surfaceTertiary3);
    }

    &:focus-within {
      border: 1px solid var(--color-borderFocus);
      box-shadow: 0 0 0 1px var(--color-borderFocus);
      background-color: var(--color-surfaceWhite);

      input {
        @extend .text-secondary-text1-medium;
        outline: 0;
      }
    }

    &.success {
      border-color: var(--color-borderSuccess);
      box-shadow: 0 0 0 1px var(--color-borderSuccess);

      .icons {
        color: var(--color-textSuccess);
      }
    }

    &.error {
      border-color: var(--color-borderError);
      box-shadow: 0 0 0 1px var(--color-borderError);

      .icons {
        color: var(--color-textError);
      }
    }

    &.disabled {
      background: var(--color-interactionDisable);
      border-color: var(--color-borderNeutral);
      cursor: not-allowed;
      input {
        color: var(--color-textShy);
        cursor: not-allowed;

        &::placeholder {
          color: var(--color-textShy);
        }
      }

      .icons {
        color: var(--color-textShy);
      }

      &.error,
      &.success {
        box-shadow: none;
      }
    }

    input {
      @extend .text-secondary-text1-regular;
      height: 100%;
      width: 100%;
      border: none;
      background: transparent;
      color: var(--color-textDark);

      &::placeholder {
        @extend .text-secondary-text2-regular;
        color: var(--color-textNeutral);
      }
    }

    .icons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacingXS);
      color: var(--color-textHighlightTertiary);

      :global(.input-icon) {
        width: 20px;
        height: 20px;
      }
    }
  }
</style>

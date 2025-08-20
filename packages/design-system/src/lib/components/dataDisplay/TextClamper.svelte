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
  import { onMount } from 'svelte';

  import Text from '$lib/components/Text.svelte';
  import { debounce } from '$lib/time';
  import { generateId } from '$lib/id';

  let bodyWrapperElement: null | { scrollHeight: number; clientHeight: number } = null;

  export let linesNotClamped = 1;

  /** To let the freedom to translate this label in the web app */
  export let showMoreLabel = 'Show more';
  export let showLessLabel = 'Show less';

  let isOpen = false;

  const isTextClamped = () => {
    if (!isOpen) {
      return (
        bodyWrapperElement && bodyWrapperElement.scrollHeight > bodyWrapperElement.clientHeight
      );
    }
    return false;
  };

  $: checkboxId = `text-clamper-check-${generateId()}`;
  $: lines = linesNotClamped > 0 && linesNotClamped <= 20 ? linesNotClamped : 1;
  $: clampAfter = `clamp-after-${lines}-lines`;
  $: isClamped = isTextClamped();

  onMount(() => {
    isClamped = isTextClamped();
    const setIsClamped = debounce(() => {
      isClamped = isTextClamped();
    });

    window.addEventListener('resize', setIsClamped);

    return () => {
      window.removeEventListener('resize', setIsClamped);
    };
  });
</script>

<div class="text-clamper">
  <input id={checkboxId} class="text-clamper-check" type="checkbox" bind:checked={isOpen} />
  <div class={`text-clamper-body ${clampAfter}`} bind:this={bodyWrapperElement}>
    <slot />
  </div>

  {#if isClamped || isOpen}
    <label for={checkboxId} class="text-clamper-label">
      <span class="text-clamper-show-less"
        ><Text type="caption1Bold" as="span">{showLessLabel}</Text>
      </span>
      <span class="text-clamper-show-more"
        ><Text type="caption1Bold" as="span">{showMoreLabel}</Text></span
      >
    </label>
  {/if}
</div>

<style>
  /* // This is a trick to fade the text away when the webkit line clamp trick is not available.
  // I've not used it because we would have to ask for the line height, which we do not know.
  
   @mixin truncate($rows, $line-height, $background: '') {
     position: relative;
     overflow: hidden;
     max-height: $line-height * $rows;
     line-height: $line-height
     &:after {
       content: '';
       position: absolute;
       right: 0;
       bottom: 0;
       width: 100px;
       height: $line-height
       @if $background != '' {
         background: linear-gradient(to right, rgba($background, 0) 0%, rgba($background, 1) 100%);
       }
     
     // If supports line-clamp then add an ellipsis overflow and hide the gradient
     // This will work in Chrome and Opera, otherwise a gradient will gradually hide the text.
     @supports (-webkit-line-clamp: $rows) {
       display: -webkit-box;
       -webkit-line-clamp: $rows;
       -webkit-box-orient: vertical
       &:after {
         display: none;
       }
     }
   }

  .text-clamper {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: var(--spacing3XS);

    .text-clamper-body {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    @for $i from 1 through 20 {
      .clamp-after-#{$i}-lines {
        -webkit-line-clamp: $i;
        line-clamp: $i;
      }
    }

    .text-clamper-check {
      display: none;
      &:checked ~ .text-clamper-label .text-clamper-show-less {
        display: block;
      }
      &:checked ~ .text-clamper-label .text-clamper-show-more {
        display: none;
      }

      &:checked ~ .text-clamper-body {
        display: block;
        max-height: 100%;
      }
    }

    .text-clamper-label {
      cursor: pointer;
      align-self: flex-end;

      &.disabled,
      &:disabled,
      &:disabled:hover {
        cursor: not-allowed;
      }

      &:hover {
        cursor: pointer;
      }
      &:focus,
      &:active {
        outline: none;
      }

      .text-clamper-show-less,
      .text-clamper-show-more {
        text-decoration: underline;
      }
      .text-clamper-show-less {
        display: none;
      }
    }
  } */
</style>

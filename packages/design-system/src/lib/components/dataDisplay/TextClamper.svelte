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
  .text-clamper {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: var(--spacing3XS);
  }

  .text-clamper .text-clamper-body {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .text-clamper .clamp-after-1-lines {
    -webkit-line-clamp: 1;
    line-clamp: 1;
  }
  .text-clamper .clamp-after-2-lines {
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
  .text-clamper .clamp-after-3-lines {
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }
  .text-clamper .clamp-after-4-lines {
    -webkit-line-clamp: 4;
    line-clamp: 4;
  }
  .text-clamper .clamp-after-5-lines {
    -webkit-line-clamp: 5;
    line-clamp: 5;
  }
  .text-clamper .clamp-after-6-lines {
    -webkit-line-clamp: 6;
    line-clamp: 6;
  }
  .text-clamper .clamp-after-7-lines {
    -webkit-line-clamp: 7;
    line-clamp: 7;
  }
  .text-clamper .clamp-after-8-lines {
    -webkit-line-clamp: 8;
    line-clamp: 8;
  }
  .text-clamper .clamp-after-9-lines {
    -webkit-line-clamp: 9;
    line-clamp: 9;
  }
  .text-clamper .clamp-after-10-lines {
    -webkit-line-clamp: 10;
    line-clamp: 10;
  }
  .text-clamper .clamp-after-11-lines {
    -webkit-line-clamp: 11;
    line-clamp: 11;
  }
  .text-clamper .clamp-after-12-lines {
    -webkit-line-clamp: 12;
    line-clamp: 12;
  }
  .text-clamper .clamp-after-13-lines {
    -webkit-line-clamp: 13;
    line-clamp: 13;
  }
  .text-clamper .clamp-after-14-lines {
    -webkit-line-clamp: 14;
    line-clamp: 14;
  }
  .text-clamper .clamp-after-15-lines {
    -webkit-line-clamp: 15;
    line-clamp: 15;
  }
  .text-clamper .clamp-after-16-lines {
    -webkit-line-clamp: 16;
    line-clamp: 16;
  }
  .text-clamper .clamp-after-17-lines {
    -webkit-line-clamp: 17;
    line-clamp: 17;
  }
  .text-clamper .clamp-after-18-lines {
    -webkit-line-clamp: 18;
    line-clamp: 18;
  }
  .text-clamper .clamp-after-19-lines {
    -webkit-line-clamp: 19;
    line-clamp: 19;
  }
  .text-clamper .clamp-after-20-lines {
    -webkit-line-clamp: 20;
    line-clamp: 20;
  }

  .text-clamper .text-clamper-check {
    display: none;
  }

  .text-clamper .text-clamper-check:checked ~ .text-clamper-label .text-clamper-show-less {
    display: block;
  }

  .text-clamper .text-clamper-check:checked ~ .text-clamper-label .text-clamper-show-more {
    display: none;
  }

  .text-clamper .text-clamper-check:checked ~ .text-clamper-body {
    display: block;
    max-height: 100%;
  }

  .text-clamper .text-clamper-label {
    cursor: pointer;
    align-self: flex-end;
  }

  .text-clamper .text-clamper-label.disabled,
  .text-clamper .text-clamper-label:disabled,
  .text-clamper .text-clamper-label:disabled:hover {
    cursor: not-allowed;
  }

  .text-clamper .text-clamper-label:hover {
    cursor: pointer;
  }

  .text-clamper .text-clamper-label:focus,
  .text-clamper .text-clamper-label:active {
    outline: none;
  }

  .text-clamper .text-clamper-label .text-clamper-show-less,
  .text-clamper .text-clamper-label .text-clamper-show-more {
    text-decoration: underline;
  }

  .text-clamper .text-clamper-label .text-clamper-show-less {
    display: none;
  }
</style>

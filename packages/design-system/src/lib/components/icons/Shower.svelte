<!--
Soliguide: Useful information for those who need it

SPDX-FileCopyrightText: © 2025 Solinum

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
  import type { VariationType } from '$lib/types/Icons';

  export let size = '24';
  export let color = 'currentColor';
  export let variation: VariationType = 'outlined';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  {...$$restProps}
  width={size}
  height={size}
  fill={color}
  aria-hidden="true"
  viewBox="0 0 24 24"
>
  {#if variation === 'outlined'}
    <path
      d="M9 17c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm3-1c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm4 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm3-4v2H5v-2c0-3.53 2.61-6.43 6-6.92V3h2v2.08c3.39.49 6 3.39 6 6.92zm-2 0c0-2.76-2.24-5-5-5s-5 2.24-5 5h10zm-9 7c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm4 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm4 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"
    />
  {:else if variation === 'filled'}
    <circle cx="8" cy="17" r="1" /><circle cx="12" cy="17" r="1" /><circle
      cx="16"
      cy="17"
      r="1"
    /><path d="M13 5.08V3h-2v2.08C7.61 5.57 5 8.47 5 12v2h14v-2c0-3.53-2.61-6.43-6-6.92z" /><circle
      cx="8"
      cy="20"
      r="1"
    /><circle cx="12" cy="20" r="1" /><circle cx="16" cy="20" r="1" />
  {/if}
</svg>

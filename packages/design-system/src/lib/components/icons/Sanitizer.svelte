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
      d="M15.5 6.5C15.5 5.66 17 4 17 4s1.5 1.66 1.5 2.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5zm4 8.5a2.5 2.5 0 0 0 2.5-2.5c0-1.67-2.5-4.5-2.5-4.5S17 10.83 17 12.5a2.5 2.5 0 0 0 2.5 2.5zM13 14h-2v-2H9v2H7v2h2v2h2v-2h2v-2zm3-2v8c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-8c0-2.97 2.16-5.43 5-5.91V4H7V2h6c1.13 0 2.15.39 2.99 1.01l-1.43 1.43C14.1 4.17 13.57 4 13 4h-2v2.09c2.84.48 5 2.94 5 5.91zm-2 0c0-2.21-1.79-4-4-4s-4 1.79-4 4v8h8v-8z"
    />
  {:else if variation === 'filled'}
    <path
      d="M15.5 6.5C15.5 5.66 17 4 17 4s1.5 1.66 1.5 2.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5zm4 8.5a2.5 2.5 0 0 0 2.5-2.5c0-1.67-2.5-4.5-2.5-4.5S17 10.83 17 12.5a2.5 2.5 0 0 0 2.5 2.5zM13 14h-2v-2H9v2H7v2h2v2h2v-2h2v-2zm3-2v10H4V12c0-2.97 2.16-5.43 5-5.91V4H7V2h6c1.13 0 2.15.39 2.99 1.01l-1.43 1.43C14.1 4.17 13.57 4 13 4h-2v2.09c2.84.48 5 2.94 5 5.91z"
    />
  {/if}
</svg>

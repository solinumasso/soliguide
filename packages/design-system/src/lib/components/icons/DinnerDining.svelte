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
      d="m2 19 2 2h16l2-2zm1-1h16.97c.29-3.26-2.28-6-5.48-6-2.35 0-4.35 1.48-5.14 3.55-.41-.23-.87-.38-1.35-.47V9h1.75C10.99 9 12 7.99 12 6.75h9v-1.5h-9C12 4.01 10.99 3 9.75 3H3v1.5h1v.75H3v1.5h1v.75H3V9h1v7.39c-.44.46-.78 1-1 1.61zm11.5-4c.99 0 1.91.4 2.58 1.14.24.26.44.55.58.86h-6.32c.58-1.21 1.81-2 3.16-2zM8 4.5h2v.75H8V4.5zm0 2.25h2v.75H8v-.75zM5.5 4.5h1v.75h-1V4.5zm0 2.25h1v.75h-1v-.75zM5.5 9h1v6.06c-.35.06-.68.17-1 .3V9z"
    />
  {:else if variation === 'filled'}
    <path
      d="M2 19h20l-2 2H4l-2-2zM5 6h1v1H5V6zm0-2h1v1H5V4zm4 0v1H7V4h2zm0 3H7V6h2v1zm-3 8.23c-.36.11-.69.28-1 .47V8h1v7.23zm-2 1.29c-.38.44-.68.93-.84 1.48h16.82c.01-.16.03-.33.03-.5a5.497 5.497 0 0 0-10.58-2.1c-.59-.25-1.24-.4-1.93-.4-.17 0-.33.02-.5.04V8h2c1.03.06 1.9-.96 2-2h10V5H11c-.1-1.05-.97-1.97-2-2H3v1h1v1H3v1h1v1H3v1h1v8.52z"
    />
  {/if}
</svg>

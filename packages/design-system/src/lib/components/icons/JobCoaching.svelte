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

  export let size = '48';
  export let color = 'currentColor';
  export let variation: VariationType = 'outlined';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  {...$$restProps}
  width={size}
  height={size}
  fill="none"
  aria-hidden="true"
  viewBox="0 0 48 48"
>
  <g id="job coaching">
    {#if variation === 'outlined'}
      <path
        id="Vector"
        d="M40 4H8.02C5.82 4 4.02 5.8 4.02 8L4.00268 39.1678C4.00169 40.9501 6.15659 41.8434 7.4169 40.5831L12 36H40C42.2 36 44 34.2 44 32V8C44 5.8 42.2 4 40 4ZM40 32H10.34L8 34.34V8H40V32Z"
        fill={color}
      />
      <path
        id="Vector_2"
        d="M30 14.875H27V13.375C27 12.5425 26.3325 11.875 25.5 11.875H22.5C21.6675 11.875 21 12.5425 21 13.375V14.875H18C17.1675 14.875 16.5075 15.5425 16.5075 16.375L16.5 24.625C16.5 25.4575 17.1675 26.125 18 26.125H30C30.8325 26.125 31.5 25.4575 31.5 24.625V16.375C31.5 15.5425 30.8325 14.875 30 14.875ZM25.5 14.875H22.5V13.375H25.5V14.875Z"
        fill={color}
      />
    {:else if variation === 'filled'}
      <path
        id="Subtract"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.01976 4H39.9998C42.1998 4 43.9998 5.8 43.9998 8V32C43.9998 34.2 42.1998 36 39.9998 36H11.9998L7.41666 40.5831C6.15635 41.8434 4.00145 40.9501 4.00244 39.1678L4.01976 8C4.01976 5.8 5.81976 4 8.01976 4ZM26.9998 14.875H29.9998C30.8323 14.875 31.4998 15.5425 31.4998 16.375V24.625C31.4998 25.4575 30.8323 26.125 29.9998 26.125H17.9998C17.1673 26.125 16.4998 25.4575 16.4998 24.625L16.5073 16.375C16.5073 15.5425 17.1673 14.875 17.9998 14.875H20.9998V13.375C20.9998 12.5425 21.6673 11.875 22.4998 11.875H25.4998C26.3323 11.875 26.9998 12.5425 26.9998 13.375V14.875ZM22.4998 14.875H25.4998V13.375H22.4998V14.875Z"
        fill={color}
      />
    {/if}
  </g>
</svg>

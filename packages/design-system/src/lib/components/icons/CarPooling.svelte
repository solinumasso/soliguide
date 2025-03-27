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
  <g id="carpooling">
    {#if variation === 'outlined'}
      <g id="Vector">
        <path
          d="M19.8677 16.25H16.1323C14.8409 16.25 13.8484 17.1595 14.0192 18.171L15.8655 22H20.1345L21.9808 18.171C22.1516 17.1595 21.1591 16.25 19.8677 16.25Z"
          fill={color}
        />
        <path
          d="M18 15.4C19.1789 15.4 20.1345 14.6389 20.1345 13.7C20.1345 12.7611 19.1789 12 18 12C16.8211 12 15.8655 12.7611 15.8655 13.7C15.8655 14.6389 16.8211 15.4 18 15.4Z"
          fill={color}
        />
      </g>
      <g id="Vector_2">
        <path
          d="M31.8677 16.25H28.1323C26.8409 16.25 25.8484 17.1595 26.0192 18.171L27.8655 22H32.1345L33.9808 18.171C34.1516 17.1595 33.1591 16.25 31.8677 16.25Z"
          fill={color}
        />
        <path
          d="M30 15.4C31.1789 15.4 32.1345 14.6389 32.1345 13.7C32.1345 12.7611 31.1789 12 30 12C28.8211 12 27.8655 12.7611 27.8655 13.7C27.8655 14.6389 28.8211 15.4 30 15.4Z"
          fill={color}
        />
      </g>
      <g id="Vector_3">
        <path
          d="M40.1467 8.35667C39.68 6.98 38.3733 6 36.8333 6H11.1667C9.62667 6 8.34333 6.98 7.85333 8.35667L3 22.3333V41C3 42.2833 4.05 43.3333 5.33333 43.3333H7.66667C8.95 43.3333 10 42.2833 10 41V38.6667H38V41C38 42.2833 39.05 43.3333 40.3333 43.3333H42.6667C43.95 43.3333 45 42.2833 45 41V22.3333L40.1467 8.35667ZM11.9833 10.6667H35.9933L38.5133 17.9233H9.46333L11.9833 10.6667ZM40.3333 34H7.66667V22.3333H40.3333V34Z"
          fill={color}
        />
        <path
          d="M13.5 31.6667C15.433 31.6667 17 30.0997 17 28.1667C17 26.2337 15.433 24.6667 13.5 24.6667C11.567 24.6667 10 26.2337 10 28.1667C10 30.0997 11.567 31.6667 13.5 31.6667Z"
          fill={color}
        />
        <path
          d="M34.5 31.6667C36.433 31.6667 38 30.0997 38 28.1667C38 26.2337 36.433 24.6667 34.5 24.6667C32.567 24.6667 31 26.2337 31 28.1667C31 30.0997 32.567 31.6667 34.5 31.6667Z"
          fill={color}
        />
      </g>
    {:else if variation === 'filled'}
      <g id="Vector">
        <path
          d="M19.8677 15.25H16.1323C14.8409 15.25 13.8484 16.1595 14.0192 17.171L15.8655 23H20.1345L21.9808 17.171C22.1516 16.1595 21.1591 15.25 19.8677 15.25Z"
          fill={color}
        />
        <path
          d="M18 14.4C19.1789 14.4 20.1345 13.6389 20.1345 12.7C20.1345 11.7611 19.1789 11 18 11C16.8211 11 15.8655 11.7611 15.8655 12.7C15.8655 13.6389 16.8211 14.4 18 14.4Z"
          fill={color}
        />
      </g>
      <g id="Vector_2">
        <path
          d="M31.8677 15.25H28.1323C26.8409 15.25 25.8484 16.1595 26.0192 17.171L27.8655 23H32.1345L33.9808 17.171C34.1516 16.1595 33.1591 15.25 31.8677 15.25Z"
          fill={color}
        />
        <path
          d="M30 14.4C31.1789 14.4 32.1345 13.6389 32.1345 12.7C32.1345 11.7611 31.1789 11 30 11C28.8211 11 27.8655 11.7611 27.8655 12.7C27.8655 13.6389 28.8211 14.4 30 14.4Z"
          fill={color}
        />
      </g>
      <path
        id="Vector_3"
        d="M40.1467 7.68992C39.68 6.31325 38.3733 5.33325 36.8333 5.33325H11.1667C9.62667 5.33325 8.34333 6.31325 7.85333 7.68992L3.25667 20.9199C3.09333 21.4099 3 21.9233 3 22.4599V39.1666C3 41.1032 4.56333 42.6666 6.5 42.6666C8.43667 42.6666 10 41.1032 10 39.1666V37.9999H38V39.1666C38 41.0799 39.5633 42.6666 41.5 42.6666C43.4133 42.6666 45 41.1032 45 39.1666V22.4599C45 21.9466 44.9067 21.4099 44.7433 20.9199L40.1467 7.68992ZM11.1667 30.9999C9.23 30.9999 7.66667 29.4366 7.66667 27.4999C7.66667 25.5632 9.23 23.9999 11.1667 23.9999C13.1033 23.9999 14.6667 25.5632 14.6667 27.4999C14.6667 29.4366 13.1033 30.9999 11.1667 30.9999ZM36.8333 30.9999C34.8967 30.9999 33.3333 29.4366 33.3333 27.4999C33.3333 25.5632 34.8967 23.9999 36.8333 23.9999C38.77 23.9999 40.3333 25.5632 40.3333 27.4999C40.3333 29.4366 38.77 30.9999 36.8333 30.9999ZM7.66667 19.3333L10.63 10.4199C10.9567 9.48658 11.8433 8.83325 12.8467 8.83325H35.1533C36.1567 8.83325 37.0433 9.48658 37.37 10.4199L40.3333 19.3333H7.66667Z"
        fill={color}
      />
    {/if}
  </g>
</svg>

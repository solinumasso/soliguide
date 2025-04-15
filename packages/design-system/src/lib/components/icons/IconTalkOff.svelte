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
  export let size = 16;
  export let role = 'img';
  export let color = '#171717';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  {...$$restProps}
  {role}
  width={size}
  height={size}
  fill="none"
  viewBox="0 0 17 16"
>
  <path
    id="Vector"
    d="M14 0H3.33329C2.62605 0 1.94777 0.280952 1.44767 0.781049C0.947578 1.28115 0.666626 1.95942 0.666626 2.66667L0.666626 10.6667C0.666626 11.3739 0.947578 12.0522 1.44767 12.5523C1.94777 13.0524 2.62605 13.3333 3.33329 13.3333H5.26663L8.23396 15.842C8.35434 15.9439 8.50693 15.9998 8.66463 15.9998C8.82232 15.9998 8.97492 15.9439 9.09529 15.842L12.0666 13.3333H14C14.7072 13.3333 15.3855 13.0524 15.8856 12.5523C16.3857 12.0522 16.6666 11.3739 16.6666 10.6667V2.66667C16.6666 1.95942 16.3857 1.28115 15.8856 0.781049C15.3855 0.280952 14.7072 0 14 0ZM15.3333 10.6667C15.3333 11.0203 15.1928 11.3594 14.9428 11.6095C14.6927 11.8595 14.3536 12 14 12H12.0666C11.7515 12.0001 11.4466 12.1118 11.206 12.3153L8.66663 14.46L6.12863 12.3153C5.88767 12.1115 5.58222 11.9998 5.26663 12H3.33329C2.97967 12 2.64053 11.8595 2.39048 11.6095C2.14044 11.3594 1.99996 11.0203 1.99996 10.6667V2.66667C1.99996 2.31304 2.14044 1.97391 2.39048 1.72386C2.64053 1.47381 2.97967 1.33333 3.33329 1.33333H14C14.3536 1.33333 14.6927 1.47381 14.9428 1.72386C15.1928 1.97391 15.3333 2.31304 15.3333 2.66667V10.6667Z"
    fill={color}
  />
</svg>

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
  export let color = '#FF4124';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  {...$$restProps}
  {role}
  width={size}
  height={size}
  fill="none"
  viewBox="0 0 16 16"
>
  <g id="menu-burger">
    <path
      id="Rectangle 3"
      d="M1 8C1 7.44772 1.33579 7 1.75 7H14.25C14.6642 7 15 7.44772 15 8C15 8.55228 14.6642 9 14.25 9H1.75C1.33579 9 1 8.55228 1 8Z"
      fill={color}
    />
    <path
      id="Rectangle 2"
      d="M1 13.5C1 12.9477 1.33579 12.5 1.75 12.5H14.25C14.6642 12.5 15 12.9477 15 13.5C15 14.0523 14.6642 14.5 14.25 14.5H1.75C1.33579 14.5 1 14.0523 1 13.5Z"
      fill={color}
    />
    <path
      id="Rectangle 1"
      d="M1 2.5C1 1.94772 1.33579 1.5 1.75 1.5H14.25C14.6642 1.5 15 1.94772 15 2.5C15 3.05228 14.6642 3.5 14.25 3.5H1.75C1.33579 3.5 1 3.05228 1 2.5Z"
      fill={color}
    />
  </g>
</svg>

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
  viewBox="0 0 16 16"
>
  <g id="menu-burger">
    <path
      id="Rectangle 3"
      d="M1 7.75C1 7.33579 1.33579 7 1.75 7H14.25C14.6642 7 15 7.33579 15 7.75C15 8.16421 14.6642 8.5 14.25 8.5H1.75C1.33579 8.5 1 8.16421 1 7.75Z"
      fill={color}
    />
    <path
      id="Rectangle 2"
      d="M1 13.25C1 12.8358 1.33579 12.5 1.75 12.5H14.25C14.6642 12.5 15 12.8358 15 13.25C15 13.6642 14.6642 14 14.25 14H1.75C1.33579 14 1 13.6642 1 13.25Z"
      fill={color}
    />
    <path
      id="Rectangle 1"
      d="M1 2.25C1 1.83579 1.33579 1.5 1.75 1.5H14.25C14.6642 1.5 15 1.83579 15 2.25C15 2.66421 14.6642 3 14.25 3H1.75C1.33579 3 1 2.66421 1 2.25Z"
      fill={color}
    />
  </g>
</svg>

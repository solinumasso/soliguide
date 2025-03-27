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
  <g id="home">
    <path
      id="Vector 4"
      d="M15.7197 5.14596C14.824 3.19508 9.24539 0 8.24934 0C7.2657 0 2.32231 3.09814 0.833637 5.07178C0.795872 5.12185 0.76602 5.17151 0.74344 5.22958C0.173254 6.6959 0.592556 11.9274 1.09204 14.6998C1.17497 15.1601 1.59256 15.4839 2.07351 15.4839H5.01611C5.58396 15.4839 6.04429 15.0366 6.04429 14.4849V11.6831C6.04429 11.1314 6.50463 10.6841 7.07247 10.6841L9.45883 10.6841C10.0267 10.6841 10.487 11.1314 10.487 11.6831V14.4849C10.487 15.0366 10.9473 15.4839 11.5152 15.4839H14.4667C14.9436 15.4839 15.3584 15.1654 15.4385 14.7087C15.9281 11.9166 16.266 6.27217 15.7197 5.14596Z"
      fill={color}
    />
  </g>
</svg>

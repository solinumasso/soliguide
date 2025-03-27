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
  viewBox="0 0 17 16"
>
  <g id="heart">
    <path
      id="Vector"
      d="M4.83481 1C5.58521 1.01162 6.31924 1.22023 6.96278 1.60475C7.60632 1.98927 8.13657 2.53609 8.5 3.18999C8.86343 2.53609 9.39368 1.98927 10.0372 1.60475C10.6808 1.22023 11.4148 1.01162 12.1652 1C13.3614 1.05176 14.4884 1.57288 15.3001 2.44953C16.1117 3.32617 16.5419 4.48707 16.4968 5.67861C16.4968 8.69614 13.3074 11.9917 10.6325 14.2262C10.0352 14.726 9.28012 15 8.5 15C7.71988 15 6.96476 14.726 6.36753 14.2262C3.69261 11.9917 0.503224 8.69614 0.503224 5.67861C0.458076 4.48707 0.888309 3.32617 1.69993 2.44953C2.51155 1.57288 3.63859 1.05176 4.83481 1Z"
      fill={color}
    />
  </g>
</svg>

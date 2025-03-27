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
  <g id="heart">
    <path
      id="Vector"
      d="M4.33481 1C5.08521 1.01162 5.81924 1.22023 6.46278 1.60475C7.10632 1.98927 7.63657 2.53609 8 3.18999C8.36343 2.53609 8.89368 1.98927 9.53722 1.60475C10.1808 1.22023 10.9148 1.01162 11.6652 1C12.8614 1.05176 13.9884 1.57288 14.8001 2.44953C15.6117 3.32617 16.0419 4.48707 15.9968 5.67861C15.9968 8.69614 12.8074 11.9917 10.1325 14.2262C9.53523 14.726 8.78012 15 8 15C7.21988 15 6.46476 14.726 5.86753 14.2262C3.19261 11.9917 0.00322437 8.69614 0.00322437 5.67861C-0.0419235 4.48707 0.388309 3.32617 1.19993 2.44953C2.01155 1.57288 3.13859 1.05176 4.33481 1ZM6.72385 13.2108C7.08105 13.5104 7.53302 13.6746 8 13.6746C8.46698 13.6746 8.91895 13.5104 9.27615 13.2108C12.7001 10.3499 14.664 7.60513 14.664 5.67861C14.7095 4.83892 14.4198 4.01537 13.8581 3.38755C13.2963 2.75973 12.508 2.3786 11.6652 2.32726C10.8223 2.3786 10.0341 2.75973 9.47231 3.38755C8.91054 4.01537 8.62084 4.83892 8.6664 5.67861C8.6664 5.85461 8.59619 6.02341 8.47121 6.14786C8.34624 6.27232 8.17674 6.34224 8 6.34224C7.82326 6.34224 7.65376 6.27232 7.52878 6.14786C7.40381 6.02341 7.3336 5.85461 7.3336 5.67861C7.37916 4.83892 7.08946 4.01537 6.52769 3.38755C5.96591 2.75973 5.17765 2.3786 4.33481 2.32726C3.49197 2.3786 2.70371 2.75973 2.14194 3.38755C1.58017 4.01537 1.29047 4.83892 1.33602 5.67861C1.33602 7.60513 3.2999 10.3499 6.72385 13.2082V13.2108Z"
      fill={color}
    />
  </g>
</svg>

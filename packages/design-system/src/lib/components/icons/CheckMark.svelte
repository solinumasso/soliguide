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
  export let size = 17;
  export let role = 'img';
  export let color = '#737373';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  {...$$restProps}
  {role}
  width={size}
  height={size}
  fill="none"
  viewBox="0 0 17 17"
>
  <path
    d="M6.04922 14.8186L16.0483 4.81806L14.0485 2.81824L6.04922 10.8189L2.04816 6.81788L0.0483398 8.81771L6.04922 14.8186Z"
    fill={color}
  />
</svg>

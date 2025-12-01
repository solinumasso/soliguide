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
  import { type types as DSTypes } from '@soliguide/design-system';
  import { Categories } from '@soliguide/common';

  export let categoryId: Categories;

  export let variation: DSTypes.VariationType = 'outlined';
  // eslint-disable-next-line no-undef-init, no-undefined
  export let size: number | undefined = undefined;

  $: icon = `category-icon-${categoryId.toLowerCase()}${variation === 'outlined' ? '_outlined' : ''}`;
</script>

<span class={icon} style={size ? `font-size: ${size}px` : ''} aria-hidden="true"></span>

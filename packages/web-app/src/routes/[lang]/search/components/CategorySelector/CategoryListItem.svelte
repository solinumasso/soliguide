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
  import { ListItem } from '@soliguide/design-system';

  export let title;
  export let subTitle = '';
  export let navigable = false;
</script>

<ListItem {subTitle} {title} shape="default" type={navigable ? 'actionFull' : 'display'} on:click>
  <span class="icon-container" slot="icon">
    <slot name="icon" />
  </span>
</ListItem>

<style lang="scss">
  .icon-container {
    color: var(--color-textHighlightSecondary);
    display: flex;
    align-items: center;

    :global(svg) {
      height: 24px;
      width: 24px;
    }
  }
</style>

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

<script lang="ts" context="module">
  import type { ComponentProps } from 'svelte';

  import type { ListItemShape, ListItemSize, ListItemType } from '$lib/types';
  import { ListItem } from '$lib/components/dataDisplay/ListItem';

  const defaultArgs: ComponentProps<ListItem> = {
    size: 'medium',
    type: 'display',
    title: 'Ici le titre',
    subTitle: 'Le sous-titre',
    shape: 'default'
  };

  export const meta = {
    title: 'Structure/List',
    component: ListItem,
    argTypes: {
      size: {
        control: { type: 'radio' },
        options: ['small', 'medium'] satisfies ListItemSize[]
      },
      type: {
        control: { type: 'radio' },
        options: ['display', 'link', 'actionRight', 'actionFull'] satisfies ListItemType[]
      },
      shape: {
        control: { type: 'radio' },
        options: ['default', 'bordered', 'rounded'] satisfies ListItemShape[]
      }
    },
    args: defaultArgs
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import AppIcon from '$lib/components/AppIcon.svelte';
  import History from 'svelte-google-materialdesign-icons/History.svelte';
  import BookmarkBorder from 'svelte-google-materialdesign-icons/Bookmark_border.svelte';
</script>

<Template let:args>
  <ListItem {...args} />
</Template>

<Template let:args id="withIcon">
  <ListItem {...args}>
    <AppIcon icon={History} disabled={args.disabled} slot="icon" />
    <BookmarkBorder slot="actionIcon" />
  </ListItem>
</Template>

<Story name="Display" args={{}} />
<Story name="Display with icon" args={{}} template="withIcon" />

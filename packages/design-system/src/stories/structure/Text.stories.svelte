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
  import Text from '$lib/components/Text.svelte';
  import type { TextColor, TextType } from '$lib/types';

  export const meta = {
    title: 'Structure/Text',
    component: Text,
    argTypes: {
      type: {
        control: { type: 'radio' },
        options: [
          'display1',
          'display2',
          'title1PrimaryExtraBold',
          'title2PrimaryExtraBold',
          'title3PrimaryExtraBold',
          'title4PrimaryExtraBold',
          'title1PrimaryBold',
          'title2PrimaryBold',
          'title3PrimaryBold',
          'title4PrimaryBold',
          'title1SecondaryBold',
          'title2SecondaryBold',
          'text1',
          'text2',
          'text1Medium',
          'text2Medium',
          'text1Bold',
          'text2Bold',
          'caption1',
          'caption2',
          'caption1Medium',
          'caption2Medium',
          'caption1Bold',
          'caption2Bold'
        ] satisfies TextType[]
      },
      color: {
        control: { type: 'radio' },
        options: [
          'dark',
          'neutral',
          'shy',
          'inverse',
          'highlightPrimary',
          'highlightSecondary',
          'highlightTertiary',
          'highlightQuartary',
          'focus',
          'success',
          'warning',
          'error'
        ] satisfies TextColor[]
      },
      as: { table: { disable: true } }
    },
    args: {
      label: 'This is a sample text. 12345',
      type: 'display1' satisfies TextType
    }
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
  <Text {...args}
    >{args.type}
    {#if args.color}- {args.color}
    {/if}- {args.label}</Text
  >
</Template>

<Story name="Default" />
<Story name="Text with forced tag" parameters={{ controls: { disable: true } }}>
  <Text type="text1" as="h1">This is a sample 'text1' with a H1 tag</Text>
</Story>

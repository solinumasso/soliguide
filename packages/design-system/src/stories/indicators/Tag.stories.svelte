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

  import type { TagSize, TagVariant } from '$lib/types';
  import Tag from '$lib/components/dataDisplay/Tag.svelte';

  const defaultArgs: ComponentProps<Tag> & { showIcon: boolean } = {
    size: 'medium',
    variant: 'neutral',
    type: 'display',
    showIcon: true
  };

  export const meta = {
    title: 'Indicators/Tag',
    component: Tag,
    argTypes: {
      variant: {
        control: { type: 'radio' },
        options: ['neutral', 'success', 'warning', 'error'] satisfies TagVariant[]
      },
      size: {
        control: { type: 'radio' },
        options: ['small', 'medium'] satisfies TagSize[]
      },
      showIcon: { control: 'boolean' }
    }
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import Star from 'svelte-google-materialdesign-icons/Star.svelte';
</script>

<Template let:args>
  <Tag {...args}>
    <svelte:fragment slot="icon">
      {#if args.showIcon}
        <Star />
      {/if}
    </svelte:fragment>
    Tag
  </Tag>
</Template>

<Story name="Default" args={{ ...defaultArgs }} />

<Story name="Tag variants" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <Tag variant="neutral">Tag</Tag>
    <Tag variant="success">Tag</Tag>
    <Tag variant="warning">Tag</Tag>
    <Tag variant="error">Tag</Tag>
  </div>
</Story>

<Story name="Tag variants with icon" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <Tag variant="neutral">Tag</Tag>
    <Tag variant="success">
      <Star slot="icon" />
      Tag</Tag
    >
    <Tag variant="warning">
      <Star slot="icon" />
      Tag</Tag
    >
    <Tag variant="error">
      <Star slot="icon" />
      Tag</Tag
    >
  </div>
</Story>

<Story name="Tag variants with badge" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <Tag variant="neutral" type="badge">Tag</Tag>
    <Tag variant="success" type="badge">Tag</Tag>
    <Tag variant="warning" type="badge">Tag</Tag>
    <Tag variant="error" type="badge">Tag</Tag>
  </div>
</Story>

<style lang="scss">
  .story-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }
</style>

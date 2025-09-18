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

  import type { InfoIconSize, InfoIconVariant } from '$lib/types';
  import InfoIcon from '$lib/components/InfoIcon.svelte';

  const defaultArgs: ComponentProps<InfoIcon> = {
    variant: 'info',
    size: 'medium',
    withShadow: true
  };

  export const meta = {
    title: 'Indicators/InfoIcon',
    component: InfoIcon,
    argTypes: {
      variant: {
        control: { type: 'radio' },
        options: ['info', 'success', 'warning', 'error'] satisfies InfoIconVariant[]
      },
      size: {
        control: { type: 'radio' },
        options: ['small', 'medium'] satisfies InfoIconSize[]
      }
    },
    args: defaultArgs
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
  <InfoIcon {...args} />
</Template>

<Story name="Default" />

<Story name="InfoIcon sizes" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <InfoIcon {...defaultArgs} size="medium" />
    <InfoIcon {...defaultArgs} size="small" />
  </div>
</Story>

<Story name="InfoIcon shadows or not" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <InfoIcon {...defaultArgs} withShadow={true} />
    <InfoIcon {...defaultArgs} withShadow={false} />
  </div>
</Story>

<Story name="InfoIcon variants" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <InfoIcon {...defaultArgs} variant="info" />
    <InfoIcon {...defaultArgs} variant="success" />
    <InfoIcon {...defaultArgs} variant="warning" />
    <InfoIcon {...defaultArgs} variant="error" />
  </div>
</Story>

<style>
  .story-row {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-direction: row;
    padding-bottom: 8px;
  }
</style>

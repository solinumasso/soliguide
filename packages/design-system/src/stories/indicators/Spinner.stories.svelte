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
  import type { SpinnerSize, SpinnerType } from '$lib/types';

  import Spinner from '$lib/components/Spinner.svelte';

  const defaultArgs: ComponentProps<Spinner> = {
    type: 'primary',
    size: 'medium'
  };

  export const meta = {
    title: 'Indicators/Spinner',
    component: Spinner,
    argTypes: {
      type: {
        control: { type: 'radio' },
        options: [
          'primary',
          'primaryWithBackground',
          'reversed',
          'reversedWithBackground'
        ] satisfies SpinnerType[]
      },
      size: {
        control: { type: 'radio' },
        options: ['small', 'medium', 'large'] satisfies SpinnerSize[]
      }
    },
    args: defaultArgs
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
  <Spinner {...args} />
</Template>

<Story name="Default" />

<div class="story-row">
  <Story name="Spinner sizes" parameters={{ controls: { disable: true } }}>
    <Spinner {...defaultArgs} size="large"></Spinner>
    <Spinner {...defaultArgs} size="medium"></Spinner>
    <Spinner {...defaultArgs} size="small"></Spinner>
  </Story>
</div>

<div class="story-row">
  <Story name="Spinner variants" parameters={{ controls: { disable: true } }}>
    <Spinner {...defaultArgs} type="primary"></Spinner>
    <Spinner {...defaultArgs} type="primaryWithBackground"></Spinner>
    <Spinner {...defaultArgs} type="neutral"></Spinner>
    <Spinner {...defaultArgs} type="neutralWithBackground"></Spinner>
    <Spinner {...defaultArgs} type="reversed"></Spinner>
    <Spinner {...defaultArgs} type="reversedWithBackground"></Spinner>
  </Story>
</div>

<style>
  .story-row {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-direction: row;
  }
</style>

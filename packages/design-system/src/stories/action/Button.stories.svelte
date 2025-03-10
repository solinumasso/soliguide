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

  import type { ButtonShape, ButtonSize, ButtonType, IconPosition } from '$lib/types';
  import Button from '$lib/components/buttons/Button.svelte';

  const defaultArgs: ComponentProps<Button> = {
    label: 'Button text',
    type: 'primaryFill',
    size: 'medium',
    shape: 'square',
    iconPosition: null
  };

  export const meta = {
    title: 'Action/Button',
    component: Button,
    argTypes: {
      type: {
        control: { type: 'radio' },
        options: [
          'primaryFill',
          'primaryGradientFill',
          'primaryOutline',
          'neutralFill',
          'neutralOutlined',
          'shy',
          'reversed'
        ] satisfies ButtonType[]
      },
      size: {
        control: { type: 'radio' },
        options: ['xsmall', 'small', 'medium', 'large'] satisfies ButtonSize[]
      },
      shape: {
        control: { type: 'radio' },
        options: ['square', 'rounded'] satisfies ButtonShape[]
      },
      icon: { table: { disable: true } },
      hasIcon: { table: { disable: true } },
      iconPosition: {
        control: 'radio',
        options: [null, 'reversed', 'iconOnly'] satisfies (IconPosition | null)[],
        if: { arg: 'hasIcon' }
      },
      submit: { table: { disable: true } }
    },
    args: defaultArgs
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import Star from 'svelte-google-materialdesign-icons/Star.svelte';
  import Email from 'svelte-google-materialdesign-icons/Email.svelte';
</script>

<Template let:args>
  <Button {...args} on:click>{args.label}</Button>
</Template>

<Template id="withMailIcon" let:args>
  <Button {...args} on:click>
    <Email variation="outlined" slot="icon" />
    {args.label}
  </Button>
</Template>

<Template id="withStarIcon" let:args>
  <Button {...args} on:click>
    <Star slot="icon" />
    {args.label}
  </Button>
</Template>

<Story name="Default" source />
<Story name="With icon" template="withMailIcon" args={{ hasIcon: true }} />
<Story name="With Star icon" template="withStarIcon" args={{ hasIcon: true }} />
<Story name="Disabled" args={{ disabled: true }} />

<Story name="Button variants" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <Button {...defaultArgs} type="primaryFill">{defaultArgs.label}</Button>
    <Button {...defaultArgs} type="primaryGradientFill">{defaultArgs.label}</Button>
    <!-- <Button {...defaultArgs} type="primaryOutline">{defaultArgs.label}</Button>-->
    <Button {...defaultArgs} type="neutralFill">{defaultArgs.label}</Button>
    <Button {...defaultArgs} type="neutralOutlined">{defaultArgs.label}</Button>
    <Button {...defaultArgs} type="shy">{defaultArgs.label}</Button>
    <Button {...defaultArgs} type="reversed">{defaultArgs.label}</Button>
  </div>
</Story>

<Story name="Button sizes" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <Button {...defaultArgs} size="large">{defaultArgs.label}</Button>
    <Button {...defaultArgs} size="medium">{defaultArgs.label}</Button>
    <Button {...defaultArgs} size="small">{defaultArgs.label}</Button>
    <Button {...defaultArgs} size="xsmall">{defaultArgs.label}</Button>
  </div>
</Story>

<Story name="Button shapes" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <Button {...defaultArgs} shape="square">{defaultArgs.label}</Button>
    <Button {...defaultArgs} shape="rounded">{defaultArgs.label}</Button>
    <Button {...defaultArgs} iconPosition="iconOnly">
      <Star slot="icon" />
      {defaultArgs.label}
    </Button>
  </div>
</Story>

<Story name="Button loading" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <Button {...defaultArgs} isLoading={true} submit shape="square">{defaultArgs.label}</Button>
    <Button {...defaultArgs} isLoading={true} submit shape="rounded">{defaultArgs.label}</Button>
    <Button {...defaultArgs} type="neutralOutlined" isLoading={true} submit shape="square"
      >{defaultArgs.label}</Button
    >
    <Button {...defaultArgs} type="primaryOutline" isLoading={true} submit shape="square"
      >{defaultArgs.label}</Button
    >
    <Button {...defaultArgs} type="neutralFill" isLoading={true} submit shape="square"
      >{defaultArgs.label}</Button
    >
  </div>
</Story>

<style lang="scss">
  .story-row {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-direction: row;
  }
</style>

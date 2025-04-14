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
  import ButtonLink from '$lib/components/buttons/ButtonLink.svelte';

  const defaultArgs: ComponentProps<ButtonLink> = {
    label: 'Button text',
    type: 'primaryFill',
    size: 'medium',
    shape: 'square',
    iconPosition: null,
    href: 'www.google.com'
  };

  export const meta = {
    title: 'Action/ButtonLink',
    component: ButtonLink,
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
      blank: { table: { disable: true } },
      icon: { table: { disable: true } },
      hasIcon: { table: { disable: true } },
      iconPosition: {
        control: 'radio',
        options: [null, 'reversed', 'iconOnly'] satisfies (IconPosition | null)[],
        if: { arg: 'hasIcon' }
      }
    },
    args: defaultArgs
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import Star from 'svelte-google-materialdesign-icons/Star.svelte';
</script>

<Template let:args>
  <ButtonLink {...args}>{args.label}</ButtonLink>
</Template>

<Template id="withStarIcon" let:args>
  <ButtonLink {...args}>
    <Star slot="icon" />
    {args.label}
  </ButtonLink>
</Template>

<Story name="Default" args={{}} />
<Story name="With icon" template="withStarIcon" args={{ hasIcon: true }} />
<Story name="Disabled" args={{ disabled: true }} />

<Story name="ButtonLink variants" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <ButtonLink {...defaultArgs} type="primaryFill">{defaultArgs.label}</ButtonLink>
    <ButtonLink {...defaultArgs} type="primaryGradientFill">{defaultArgs.label}</ButtonLink>
    <ButtonLink {...defaultArgs} type="neutralFill">{defaultArgs.label}</ButtonLink>
    <ButtonLink {...defaultArgs} type="neutralOutlined">{defaultArgs.label}</ButtonLink>
    <ButtonLink {...defaultArgs} type="shy">{defaultArgs.label}</ButtonLink>
    <ButtonLink {...defaultArgs} type="reversed">{defaultArgs.label}</ButtonLink>
  </div>
</Story>

<Story name="ButtonLink sizes" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <ButtonLink {...defaultArgs} size="large">{defaultArgs.label}</ButtonLink>
    <ButtonLink {...defaultArgs} size="medium">{defaultArgs.label}</ButtonLink>
    <ButtonLink {...defaultArgs} size="small">{defaultArgs.label}</ButtonLink>
    <ButtonLink {...defaultArgs} size="xsmall">{defaultArgs.label}</ButtonLink>
  </div>
</Story>

<Story name="ButtonLink shapes" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <ButtonLink {...defaultArgs} shape="square">{defaultArgs.label}</ButtonLink>
    <ButtonLink {...defaultArgs} shape="rounded">{defaultArgs.label}</ButtonLink>
    <ButtonLink {...defaultArgs} iconPosition="iconOnly">
      <Star slot="icon" />
      {defaultArgs.label}
    </ButtonLink>
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

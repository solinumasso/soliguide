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

  import type { LinkColor, LinkSize } from '$lib/types';
  import Link from '$lib/components/Link.svelte';

  const defaultArgs: ComponentProps<Link> = {
    href: 'https://example.com',
    isExternal: false,
    icon: null,
    iconLeft: false,
    color: 'primary',
    size: 'small',
    underline: false,
    disabled: false
  };

  export const meta = {
    title: 'Action/Link',
    component: Link,
    argTypes: {
      iconLeft: {
        control: { type: 'boolean' }
      },
      color: {
        control: { type: 'radio' },
        options: ['primary', 'neutral', 'reversed'] satisfies LinkColor[]
      },
      size: {
        control: { type: 'radio' },
        options: ['xsmall', 'small'] satisfies LinkSize[]
      },
      underline: {
        control: { type: 'boolean' }
      },
      disabled: {
        control: { type: 'boolean' }
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
  <Link {...args}>Link</Link>
</Template>

<Story name="Default Link" />

<Story name="Link with Icon on Left" args={{ ...defaultArgs, icon: Star, iconLeft: true }} />

<Story name="Link with Icon on Right" args={{ ...defaultArgs, icon: Star, iconLeft: false }} />

<Story name="Disabled" args={{ ...defaultArgs, disabled: true }}>
  <div class="story-row">
    <Link {...defaultArgs} disabled={true}>Link</Link>
    <Link {...defaultArgs} icon={Star} iconLeft={true} disabled={true}>Link</Link>
  </div>
</Story>

<Story name="Link Color Variants" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <Link {...defaultArgs} color="primary">Link</Link>
    <Link {...defaultArgs} color="neutral">Link</Link>
    <Link {...defaultArgs} color="reversed">Link</Link>
  </div>
</Story>

<Story name="Link Color Variants with Underline" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <Link {...defaultArgs} color="primary" underline={true}>Link</Link>
    <Link {...defaultArgs} color="neutral" underline={true}>Link</Link>
    <Link {...defaultArgs} color="reversed" underline={true}>Link</Link>
  </div>
</Story>

<Story name="Link Size Variants" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <Link {...defaultArgs} size="xsmall">XSmall Link</Link>
    <Link {...defaultArgs} size="small">Small Link</Link>
    <Link {...defaultArgs} icon={Star} size="xsmall">XSmall Link</Link>
    <Link {...defaultArgs} icon={Star} size="small">Small Link</Link>
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

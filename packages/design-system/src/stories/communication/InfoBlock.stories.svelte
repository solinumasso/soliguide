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

  import InfoBlock from '$lib/components/dataDisplay/InfoBlock.svelte';

  const defaultArgs: ComponentProps<InfoBlock> = {
    variant: 'info',
    withIcon: true,
    withClamp: false,
    withButton: false,
    withButtonLink: false,
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus est urna, varius ut justo in, consectetur fermentum magna. Vestibulum vel orci a ligula dignissim rutrum et nec mi. Curabitur blandit quam ligula, vitae blandit metus pulvinar id. Aenean feugiat pulvinar ex a dictum. Maecenas ut libero neque. Donec posuere augue eget ex tempor rhoncus. Nunc cursus sapien libero, vitae elementum nisl tincidunt vitae. Nullam gravida mattis leo in rhoncus. Sed feugiat quam vitae ex sodales consectetur. Maecenas aliquam tortor id augue sodales, vitae tincidunt est rhoncus. Sed massa nisl, vehicula vel lectus ut, consequat condimentum metus. Sed et urna iaculis, venenatis nibh at, suscipit nunc. Donec sed neque libero. Nullam facilisis elementum efficitur. Vestibulum non accumsan quam. Etiam sit amet convallis nisl.\n' +
      'Vestibulum nec dolor vulputate, venenatis risus quis, scelerisque eros. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur ut sodales erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent pulvinar eros sit amet sem accumsan, at posuere tortor hendrerit. Etiam quis purus convallis, vehicula purus quis, eleifend purus. Duis ultricies metus at nulla lacinia pellentesque.'
  };

  export const meta = {
    title: 'Communication/InfoBlock',
    component: InfoBlock,
    argTypes: {
      variant: {
        control: { type: 'radio' },
        options: ['info', 'success', 'warning', 'error']
      },
      title: {
        control: { type: 'text' }
      },
      showMoreLabel: {
        control: { type: 'text' }
      },
      showLessLabel: {
        control: { type: 'text' }
      },
      withClamp: {
        control: { type: 'boolean' }
      }
    },
    args: defaultArgs
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
  <InfoBlock {...args} />
</Template>

<Story name="Default" args={{}} />

<Story name="InfoBlock variants" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <InfoBlock {...defaultArgs} variant="info" />
    <InfoBlock {...defaultArgs} variant="success" />
    <InfoBlock {...defaultArgs} variant="warning" />
    <InfoBlock {...defaultArgs} variant="error" />
  </div>
</Story>

<Story name="InfoBlock variations" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <InfoBlock {...defaultArgs} variant="info" />
    <InfoBlock {...defaultArgs} variant="success" withIcon withClamp />
    <InfoBlock {...defaultArgs} variant="warning" withButton buttonLabel="Action Button" />
    <InfoBlock
      {...defaultArgs}
      variant="error"
      withButtonLink
      buttonLinkLabel="Go to Link"
      buttonLinkHref="https://example.com"
    />
  </div>
</Story>

<Story name="InfoBlock title and icon combinations" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <InfoBlock {...defaultArgs} withIcon={false} />
    <InfoBlock {...defaultArgs} withIcon={false} title="No icon but title" />
    <InfoBlock {...defaultArgs} withIcon={true} title="Icon and title" />
    <InfoBlock {...defaultArgs} withIcon={true} />
  </div>
</Story>

<style>
  .story-row {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-direction: column;
    padding-bottom: 8px;
  }
</style>

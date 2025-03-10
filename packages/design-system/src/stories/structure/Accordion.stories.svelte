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

  import Accordion from '$lib/components/dataDisplay/Accordion/Accordion.svelte';
  import AccordionGroup from '$lib/components/dataDisplay/Accordion/AccordionGroup.svelte';

  const defaultArgs: Omit<ComponentProps<Accordion>, 'key'> & { text: string; showIcon: boolean } =
    {
      showIcon: true,
      title: 'Hello world',
      text:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus est urna, varius ut justo in, consectetur fermentum magna. Vestibulum vel orci a ligula dignissim rutrum et nec mi. Curabitur blandit quam ligula, vitae blandit metus pulvinar id. Aenean feugiat pulvinar ex a dictum. Maecenas ut libero neque. Donec posuere augue eget ex tempor rhoncus. Nunc cursus sapien libero, vitae elementum nisl tincidunt vitae. Nullam gravida mattis leo in rhoncus. Sed feugiat quam vitae ex sodales consectetur. Maecenas aliquam tortor id augue sodales, vitae tincidunt est rhoncus. Sed massa nisl, vehicula vel lectus ut, consequat condimentum metus. Sed et urna iaculis, venenatis nibh at, suscipit nunc. Donec sed neque libero. Nullam facilisis elementum efficitur. Vestibulum non accumsan quam. Etiam sit amet convallis nisl.\n' +
        'Vestibulum nec dolor vulputate, venenatis risus quis, scelerisque eros. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur ut sodales erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent pulvinar eros sit amet sem accumsan, at posuere tortor hendrerit. Etiam quis purus convallis, vehicula purus quis, eleifend purus. Duis ultricies metus at nulla lacinia pellentesque.'
    };

  export const meta = {
    title: 'Structure/Accordion',
    component: Accordion,
    argTypes: {
      text: {
        control: { type: 'text' }
      },
      title: {
        control: { type: 'text' }
      },
      key: {
        table: { disable: true }
      },
      isExpanded: {
        control: { type: 'boolean' }
      },
      disabled: {
        control: { type: 'boolean' }
      },
      shy: {
        control: { type: 'boolean' }
      },
      showIcon: {
        control: { type: 'boolean' }
      }
    },
    args: defaultArgs,
    parameters: {
      backgrounds: {
        default: 'light'
      }
    }
  };
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import Text from '$lib/components/Text.svelte';
  import FireTruck from 'svelte-google-materialdesign-icons/Fire_truck.svelte';
</script>

<Template let:args>
  {#if args.showIcon}
    <Accordion {...args}>
      <svelte:fragment slot="icon">
        <FireTruck />
      </svelte:fragment>
      <Text as="p" type="text1" color="neutral">{args.text}</Text>
    </Accordion>
  {:else}
    <Accordion {...args}>
      <Text as="p" type="text1" color="neutral">{args.text}</Text>
    </Accordion>
  {/if}
</Template>

<Story name="Single accordion, no group" />

<Story name="Single accordion, in a group" parameters={{ controls: { disable: true } }}>
  <AccordionGroup>
    <Accordion {...defaultArgs} key="1"
      ><Text as="p" type="text1" color="neutral">{defaultArgs.text}</Text></Accordion
    >
  </AccordionGroup>
</Story>

<Story name="Single accordion, no icon" args={{ showIcon: false }} />

<Story name="Single accordion, expanded by default" args={{ isExpanded: true }} />

<Story name="Single accordion, disabled" args={{ disabled: true }} />

<Story name="Accordions" parameters={{ controls: { disable: true } }}>
  <AccordionGroup>
    <Accordion {...defaultArgs} key="1">
      <FireTruck slot="icon" />
      <Text as="p" type="text1" color="neutral">{defaultArgs.text}</Text>
    </Accordion>
    <Accordion {...defaultArgs} key="2"><Text as="p">{defaultArgs.text}</Text></Accordion>
    <Accordion {...defaultArgs} key="3">
      <FireTruck slot="icon" />
      <Text as="p" type="text1" color="neutral">{defaultArgs.text}</Text>
    </Accordion>
    <Accordion {...defaultArgs} key="4" disabled={true}>
      <FireTruck slot="icon" />
      <Text as="p" type="text1" color="neutral">{defaultArgs.text}</Text>
    </Accordion>
  </AccordionGroup>
</Story>

<Story name="Accordions, only one expanded at a time" parameters={{ controls: { disable: true } }}>
  <AccordionGroup singleOneExpanded={true}>
    <Accordion {...defaultArgs} key="1">
      <FireTruck slot="icon" />
      <Text as="p" type="text1" color="neutral">{defaultArgs.text}</Text>
    </Accordion>
    <Accordion {...defaultArgs} key="2"><Text as="p">{defaultArgs.text}</Text></Accordion>
    <Accordion {...defaultArgs} key="3" disabled={true}>
      <FireTruck slot="icon" />
      <Text as="p" type="text1" color="neutral">{defaultArgs.text}</Text>
    </Accordion>
    <Accordion {...defaultArgs} key="4" shy={true}>
      <FireTruck slot="icon" />
      <Text as="p" type="text1" color="neutral">{defaultArgs.text}</Text>
    </Accordion>
  </AccordionGroup>
</Story>

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

  import TextClamper from '$lib/components/dataDisplay/TextClamper.svelte';

  const defaultArgs: ComponentProps<TextClamper> & { text: string } = {
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus est urna, varius ut justo in, consectetur fermentum magna. Vestibulum vel orci a ligula dignissim rutrum et nec mi. Curabitur blandit quam ligula, vitae blandit metus pulvinar id. Aenean feugiat pulvinar ex a dictum. Maecenas ut libero neque. Donec posuere augue eget ex tempor rhoncus. Nunc cursus sapien libero, vitae elementum nisl tincidunt vitae. Nullam gravida mattis leo in rhoncus. Sed feugiat quam vitae ex sodales consectetur. Maecenas aliquam tortor id augue sodales, vitae tincidunt est rhoncus. Sed massa nisl, vehicula vel lectus ut, consequat condimentum metus. Sed et urna iaculis, venenatis nibh at, suscipit nunc. Donec sed neque libero. Nullam facilisis elementum efficitur. Vestibulum non accumsan quam. Etiam sit amet convallis nisl.\n' +
      'Vestibulum nec dolor vulputate, venenatis risus quis, scelerisque eros. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur ut sodales erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent pulvinar eros sit amet sem accumsan, at posuere tortor hendrerit. Etiam quis purus convallis, vehicula purus quis, eleifend purus. Duis ultricies metus at nulla lacinia pellentesque.',
    linesNotClamped: 2
  };

  export const meta = {
    title: 'Structure/TextClamper',
    component: TextClamper,
    argTypes: {
      text: {
        control: { type: 'text' }
      },
      showMoreLabel: {
        control: { type: 'text' }
      },
      showLessLabel: {
        control: { type: 'text' }
      }
    },
    args: defaultArgs
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import Text from '$lib/components/Text.svelte';
</script>

<Template let:args>
  <TextClamper {...args}><Text as="p" type="caption1">{args.text}</Text></TextClamper>
</Template>

<Story name="Default" args={{}} />

<Story name="All number of lines before clamping" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] as item}
      <Text as="h1">Clamp after {item} lines</Text>
      <TextClamper {...defaultArgs} linesNotClamped={item}>
        <Text as="p" type="caption1"
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus est urna, varius ut
          justo in, consectetur fermentum magna. Vestibulum vel orci a ligula dignissim rutrum et
          nec mi. Curabitur blandit quam ligula, <b>vitae</b> blandit metus pulvinar id. Aenean feugiat
          pulvinar ex a dictum. Maecenas ut libero neque. Donec posuere augue eget ex tempor rhoncus.
          Nunc cursus sapien libero, vitae elementum nisl tincidunt vitae. Nullam gravida mattis leo
          in rhoncus. Sed feugiat quam vitae ex sodales consectetur. Maecenas aliquam tortor id augue
          sodales, vitae tincidunt est rhoncus. Sed massa nisl, vehicula vel lectus ut, consequat condimentum
          metus. Sed et urna iaculis, venenatis nibh at, suscipit nunc. Donec sed neque libero. Nullam
          facilisis elementum efficitur. Vestibulum non accumsan quam. Etiam sit amet convallis nisl.</Text
        >
        <Text as="p" type="caption1"
          >Vestibulum nec dolor vulputate, venenatis risus quis, scelerisque eros. Interdum et
          malesuada fames ac ante ipsum primis in faucibus. Curabitur ut sodales erat. Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent
          pulvinar eros sit amet sem accumsan, at posuere tortor hendrerit. Etiam quis purus
          convallis, vehicula purus quis, eleifend purus. Duis ultricies metus at nulla lacinia
          pellentesque.</Text
        >
        <Text as="p" type="caption1"
          >Nam sit amet dolor nec mauris imperdiet dignissim vitae id odio. Phasellus magna nunc,
          tincidunt consequat orci a, bibendum mattis justo. Pellentesque id pretium leo, in
          sollicitudin risus. Praesent dictum ex a eros congue convallis. Integer ut consequat
          ligula. In hac habitasse platea dictumst. Sed ac consectetur lorem.</Text
        >
        <Text as="p" type="caption1"
          >Mauris sollicitudin porttitor ligula sit amet porttitor. Fusce libero massa, sodales at
          lorem vitae, condimentum fermentum quam. Vestibulum ante ipsum primis in faucibus orci
          luctus et ultrices posuere cubilia curae; Cras interdum, metus eu imperdiet hendrerit,
          lorem justo blandit nisi, pellentesque tincidunt augue libero sit amet diam. Nulla nec
          quam non metus efficitur blandit et non nunc. Donec lobortis orci ultrices posuere
          vulputate. In vitae velit et sem porta interdum. Quisque pulvinar turpis nisi, in
          consequat felis egestas quis. In vel tincidunt sem. Curabitur malesuada arcu id magna
          consectetur cursus. Fusce fringilla, dolor in venenatis feugiat, ex sapien consequat nisi,
          ut finibus dui purus non tellus. Curabitur rhoncus massa dui, eget ullamcorper elit
          aliquet ut.</Text
        >
        <Text as="p" type="caption1"
          >Suspendisse commodo ut turpis eu vestibulum. Donec tellus dolor, dignissim et velit ac,
          placerat tincidunt elit. Aenean malesuada lectus orci, eu malesuada nisi suscipit at.
          Quisque mollis lacus at turpis varius, eu cursus sem ullamcorper. Donec eu nunc et tortor
          consequat dapibus et nec mauris. Morbi eu enim sit amet eros condimentum malesuada. Donec
          tempus pellentesque tortor ut mollis. Donec at viverra nibh.</Text
        >
        <Text as="p" type="caption1"
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus est urna, varius ut
          justo in, consectetur fermentum magna. Vestibulum vel orci a ligula dignissim rutrum et
          nec mi. Curabitur blandit quam ligula, <b>vitae</b> blandit metus pulvinar id. Aenean feugiat
          pulvinar ex a dictum. Maecenas ut libero neque. Donec posuere augue eget ex tempor rhoncus.
          Nunc cursus sapien libero, vitae elementum nisl tincidunt vitae. Nullam gravida mattis leo
          in rhoncus. Sed feugiat quam vitae ex sodales consectetur. Maecenas aliquam tortor id augue
          sodales, vitae tincidunt est rhoncus. Sed massa nisl, vehicula vel lectus ut, consequat condimentum
          metus. Sed et urna iaculis, venenatis nibh at, suscipit nunc. Donec sed neque libero. Nullam
          facilisis elementum efficitur. Vestibulum non accumsan quam. Etiam sit amet convallis nisl.</Text
        >
        <Text as="p" type="caption1"
          >Vestibulum nec dolor vulputate, venenatis risus quis, scelerisque eros. Interdum et
          malesuada fames ac ante ipsum primis in faucibus. Curabitur ut sodales erat. Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent
          pulvinar eros sit amet sem accumsan, at posuere tortor hendrerit. Etiam quis purus
          convallis, vehicula purus quis, eleifend purus. Duis ultricies metus at nulla lacinia
          pellentesque.</Text
        >
        <Text as="p" type="caption1"
          >Nam sit amet dolor nec mauris imperdiet dignissim vitae id odio. Phasellus magna nunc,
          tincidunt consequat orci a, bibendum mattis justo. Pellentesque id pretium leo, in
          sollicitudin risus. Praesent dictum ex a eros congue convallis. Integer ut consequat
          ligula. In hac habitasse platea dictumst. Sed ac consectetur lorem.</Text
        >
        <Text as="p" type="caption1"
          >Mauris sollicitudin porttitor ligula sit amet porttitor. Fusce libero massa, sodales at
          lorem vitae, condimentum fermentum quam. Vestibulum ante ipsum primis in faucibus orci
          luctus et ultrices posuere cubilia curae; Cras interdum, metus eu imperdiet hendrerit,
          lorem justo blandit nisi, pellentesque tincidunt augue libero sit amet diam. Nulla nec
          quam non metus efficitur blandit et non nunc. Donec lobortis orci ultrices posuere
          vulputate. In vitae velit et sem porta interdum. Quisque pulvinar turpis nisi, in
          consequat felis egestas quis. In vel tincidunt sem. Curabitur malesuada arcu id magna
          consectetur cursus. Fusce fringilla, dolor in venenatis feugiat, ex sapien consequat nisi,
          ut finibus dui purus non tellus. Curabitur rhoncus massa dui, eget ullamcorper elit
          aliquet ut.</Text
        >
        <Text as="p" type="caption1"
          >Suspendisse commodo ut turpis eu vestibulum. Donec tellus dolor, dignissim et velit ac,
          placerat tincidunt elit. Aenean malesuada lectus orci, eu malesuada nisi suscipit at.
          Quisque mollis lacus at turpis varius, eu cursus sem ullamcorper. Donec eu nunc et tortor
          consequat dapibus et nec mauris. Morbi eu enim sit amet eros condimentum malesuada. Donec
          tempus pellentesque tortor ut mollis. Donec at viverra nibh.</Text
        >
      </TextClamper>
    {/each}
  </div>
</Story>

<Story name="Too short to clamp" parameters={{ controls: { disable: true } }}>
  <TextClamper {...defaultArgs} linesNotClamped={5}>
    <Text as="p" type="caption1">Lorem ipsum dolor sit amet.</Text>
  </TextClamper>
</Story>

<Story name="Different labels" parameters={{ controls: { disable: true } }}>
  <TextClamper {...defaultArgs} showMoreLabel="Voir plus" showLessLabel="Voir moins">
    <Text as="p" type="caption1"
      >Mauris sollicitudin porttitor ligula sit amet porttitor. Fusce libero massa, sodales at lorem
      vitae, condimentum fermentum quam. Vestibulum ante ipsum primis in faucibus orci luctus et
      ultrices posuere cubilia curae; Cras interdum, metus eu imperdiet hendrerit, lorem justo
      blandit nisi, pellentesque tincidunt augue libero sit amet diam. Nulla nec quam non metus
      efficitur blandit et non nunc. Donec lobortis orci ultrices posuere vulputate. In vitae velit
      et sem porta interdum. Quisque pulvinar turpis nisi, in consequat felis egestas quis. In vel
      tincidunt sem. Curabitur malesuada arcu id magna consectetur cursus. Fusce fringilla, dolor in
      venenatis feugiat, ex sapien consequat nisi, ut finibus dui purus non tellus. Curabitur
      rhoncus massa dui, eget ullamcorper elit aliquet ut.</Text
    >
    <Text as="p" type="caption1"
      >Suspendisse commodo ut turpis eu vestibulum. Donec tellus dolor, dignissim et velit ac,
      placerat tincidunt elit. Aenean malesuada lectus orci, eu malesuada nisi suscipit at. Quisque
      mollis lacus at turpis varius, eu cursus sem ullamcorper. Donec eu nunc et tortor consequat
      dapibus et nec mauris. Morbi eu enim sit amet eros condimentum malesuada. Donec tempus
      pellentesque tortor ut mollis. Donec at viverra nibh.</Text
    >
  </TextClamper>
</Story>

<style>
  .story-row {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
</style>

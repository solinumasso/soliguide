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

  import type { InputState } from '$lib/types';
  import InputText from '$lib/components/forms/InputText.svelte';

  const defaultArgs: ComponentProps<InputText> = {
    name: 'inputDisplay',
    placeholder: 'Placeholder',
    readonly: false,
    disabled: false,
    width: '300px'
  };

  export const meta = {
    title: 'Forms/InputText',
    component: InputText,
    argTypes: {
      icon: { table: { disable: true } },
      value: { table: { disable: true } },
      name: { table: { disable: true } },
      state: {
        control: { type: 'radio' },
        options: [null, 'error', 'success'] satisfies (InputState | null)[]
      }
    },
    args: defaultArgs
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import Star from 'svelte-google-materialdesign-icons/Star.svelte';
  import { Button } from '$lib';

  let inputValue = '';
  let counter = 0;
  $: counter = inputValue ? counter : 0;
</script>

<Template let:args>
  <InputText {...args} on:input on:blur on:change on:focus on:clear></InputText>
</Template>

<Story name="Default" />
<Story name="With icon" args={{ icon: Star }} />
<Story name="Disabled" args={{ disabled: true }} />

<Story name="Controlled input" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <InputText {...defaultArgs} icon={Star} bind:value={inputValue} />
    <Button
      size="large"
      on:click={() => {
        counter += 1;
        inputValue = `New value ${counter}`;
      }}
    >
      Set new value
    </Button>
  </div>
  <div class="story-row">
    <span>input value : {inputValue}</span>
  </div>
</Story>

<Story name="Input states" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <InputText {...defaultArgs} state="error" />
    <InputText {...defaultArgs} state="success" />
  </div>
</Story>

<Story name="Input state with icon" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <InputText {...defaultArgs} state="error" icon={Star} />
    <InputText {...defaultArgs} state="success" icon={Star} />
  </div>
</Story>

<style>
  .story-row {
    display: flex;
    gap: 40px;
    align-items: center;
    flex-direction: row;
    margin-bottom: 30px;
  }
</style>

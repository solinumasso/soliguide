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

  import FormControl from '$lib/components/forms/FormControl.svelte';

  const defaultArgs: ComponentProps<FormControl> = {
    label: 'Input label',
    helper: 'Test helper',
    required: false
  };

  export const meta = {
    title: 'Forms/FormControl',
    component: FormControl,
    argTypes: {
      for: { table: { disable: true } }
    },
    args: defaultArgs
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import InputText from '$lib/components/forms/InputText.svelte';
</script>

<Template let:args>
  <FormControl {...args}>
    <InputText name="test" state={args.errorMessage ? 'error' : null} />
  </FormControl>
</Template>

<Story name="Default with text input" />

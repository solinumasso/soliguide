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

  import Toast from '$lib/components/dataDisplay/Toast.svelte';

  const defaultArgs: ComponentProps<Toast> = {
    variant: 'info',
    withIcon: true,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus est urna, varius ut justo in, consectetur fermentum magna.',
    dismissible: true,
    autoDismiss: true,
    showLoader: true
  };

  export const meta = {
    title: 'Communication/Toast',
    component: Toast,
    args: defaultArgs,
    argTypes: {
      variant: {
        control: { type: 'radio' },
        options: ['info', 'success', 'warning', 'error']
      },
      withIcon: { control: { type: 'boolean' } },
      autoDismiss: { control: { type: 'boolean' } },
      dismissible: { control: { type: 'boolean' } },
      showLoader: { control: { type: 'boolean' } },
      loaderDuration: { control: { type: 'number' }, if: { arg: 'autoDismiss' } }
    }
  };
</script>

<script lang="ts">
  import { Template, Story } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
  <Toast {...args} />
</Template>

<Story name="Default" args={{}} />

<Story name="Toast variants" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <Toast {...defaultArgs} variant="info" />
    <Toast {...defaultArgs} variant="success" />
    <Toast {...defaultArgs} variant="warning" />
    <Toast {...defaultArgs} variant="error" />
  </div>
</Story>

<Story name="Toast variations" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <Toast {...defaultArgs} description="Simple toast" />
    <Toast
      {...defaultArgs}
      variant="warning"
      description="Persistent toast"
      autoDismiss={false}
      showLoader={false}
    />
    <Toast {...defaultArgs} variant="error" description="Toast without icon" withIcon={false} />
  </div>
</Story>

<style lang="scss">
  .story-row {
    display: flex;
    gap: var(--spacingSM);
    flex-direction: column;
    align-items: flex-start;
  }
</style>

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

  import CheckMark from '$lib/components/icons/CheckMark.svelte';

  export const meta = {
    title: 'Icons/CheckMark',
    component: CheckMark,
    argTypes: {
      size: { control: { type: 'number' } },
      color: { control: { type: 'color' } }
    },
    args: {
      role: 'img',
      size: 17,
      color: '#737373',
      ariaLabel: 'checkmark'
    } satisfies ComponentProps<CheckMark>
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
  <CheckMark {...args} />
</Template>

<Story name="Default" />

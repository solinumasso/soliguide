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
  import Badge from '$lib/components/dataDisplay/Badge.svelte';
  import type { BadgeType } from '$lib/types';

  export const meta = {
    title: 'Indicators/Badge',
    component: Badge,
    argTypes: {
      type: {
        control: { type: 'radio' },
        options: ['focus', 'success', 'error', 'warning', 'reversed'] satisfies BadgeType[]
      },
      text: {
        control: { type: 'text' }
      },
      offset: {
        control: { type: 'array' },
        defaultValue: [4, 6]
      }
    }
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import Mood from 'svelte-google-materialdesign-icons/Mood.svelte';
</script>

<Template let:args id="default">
  <Badge {...args} />
</Template>

<Template let:args id="with-icon">
  <Badge {...args}>
    <div class="fake-avatar mini round">
      <Mood size="24px" />
    </div>
  </Badge>
</Template>

<Story template="default" name="Default" args={{ type: 'focus' }} />

<Story template="with-icon" name="With icon" args={{ type: 'success' }} />

<Story name="Badge type variants" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <Badge type="focus" />
    <Badge type="success" />
    <Badge type="error" />
    <Badge type="warning" />
    <Badge type="reversed" />
  </div>
</Story>

<Story name="Badge with slot contents" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <span class="msg">New messages <Badge type="error" text="7" /></span>
    <span class="msg">Needs attention <Badge type="warning" /></span>
  </div>
</Story>
<Story name="Badge with square icon">
  <div class="story-row">
    <Badge type="warning">
      <div class="fake-avatar mini"><Mood size="24px" /></div>
    </Badge>
    <Badge type="error" text="2">
      <div class="fake-avatar mini"><Mood size="24px" /></div>
    </Badge>
    <Badge type="error" text="3">
      <div class="fake-avatar midi"><Mood size="35px" /></div>
    </Badge>
    <Badge type="error" text="Bob">
      <div class="fake-avatar maxi"><Mood size="70px" /></div>
    </Badge>
  </div>
</Story>

<Story name="Badge with round icon">
  <div class="story-row">
    <Badge type="focus" offset={[4, 6]}>
      <div class="fake-avatar mini round"><Mood size="24px" /></div>
    </Badge>
    <Badge type="focus" text="51" offset={[3, 9]}>
      <div class="fake-avatar midi round"><Mood size="35px" /></div>
    </Badge>
    <Badge type="focus" text="51" offset={[12, 10]}>
      <div class="fake-avatar maxi round"><Mood size="70px" /></div>
    </Badge>
  </div>
</Story>

<style lang="scss">
  .story-row {
    display: flex;
    gap: 25px;
    align-items: flex-end;
    flex-direction: row;
    margin-bottom: 30px;
  }

  .fake-avatar {
    width: 50px;
    height: 50px;
    border-radius: var(--radiusRounded);
    background-color: var(--color-surfaceGray2);
    color: var(--color-surfaceWhite);
    display: flex;
    align-items: center;
    justify-content: center;

    &.mini {
      width: 35px;
      height: 35px;
      border-radius: var(--radiusMiddle);
    }
    &.midi {
      width: 50px;
      height: 50px;
    }
    &.maxi {
      width: 90px;
      height: 90px;
    }
    &.round {
      border-radius: var(--radiusFull);
    }
  }

  .msg {
    display: flex;
    align-items: center;
    gap: 10px;
  }
</style>

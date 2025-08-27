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
<script lang="ts">
  import Favorite from 'svelte-google-materialdesign-icons/Favorite.svelte';
  import Heart from 'svelte-google-materialdesign-icons/Sentiment_very_satisfied.svelte';
  import HeartBroken from 'svelte-google-materialdesign-icons/Heart_broken.svelte';
  import Settings from 'svelte-google-materialdesign-icons/Settings.svelte';
  import Share from 'svelte-google-materialdesign-icons/Ios_share.svelte';
  import Edit from 'svelte-google-materialdesign-icons/Edit.svelte';
  import Add from 'svelte-google-materialdesign-icons/Add_circle.svelte';
  import Superbar from './Superbar.svelte';
  import type { ActionButtonType, SuperbarAction, SuperbarActionEventKey } from '../types';

  let favoriteChecked = false;
  let favorite2Checked = false;
  $: favoriteIcon = favoriteChecked ? Heart : Favorite;
  $: heartIcon = favorite2Checked ? HeartBroken : Favorite;

  const shareAction: SuperbarAction = { label: 'Share', icon: Share, eventKey: 'share' };

  const actions1: SuperbarAction[] = [
    shareAction,
    { label: 'Settings', icon: Settings, eventKey: 'settings' }
  ];
  $: actions2 = [
    shareAction,
    {
      label: 'Favorite',
      type: 'toggle' as ActionButtonType,
      icon: favoriteIcon,
      eventKey: 'favorite' as SuperbarActionEventKey
    }
  ];
  $: actions3 = [
    shareAction,
    {
      label: 'Favorite',
      type: 'toggle' as ActionButtonType,
      icon: heartIcon,
      eventKey: 'favorite' as SuperbarActionEventKey
    }
  ];

  const actions4: SuperbarAction[] = [
    shareAction,
    { label: 'Add', icon: Add, eventKey: 'add' },
    { label: 'Throw a pen', icon: Edit, eventKey: 'edit' },
    { label: 'Settings', icon: Settings, eventKey: 'settings' }
  ];

  const toggleFavorite = () => {
    console.log('Favorite action clicked!');
    favoriteChecked = !favoriteChecked;
  };
  const toggleHeart = () => {
    console.log('Break heart action clicked!');
    favorite2Checked = !favorite2Checked;
  };
</script>

<section>
  <Superbar
    actions={actions1}
    title="With two actions"
    on:share={() => console.log('Share action clicked!')}
    on:settings={() => console.log('Settings action clicked!')}
  />
  <Superbar
    actions={actions1}
    title="With two actions"
    reversed
    on:share={() => console.log('Share action clicked!')}
    on:settings={() => console.log('Settings action clicked!')}
  />
  <Superbar
    actions={actions2}
    title="With one action and one toggle"
    on:share={() => console.log('Share action clicked!')}
    on:favorite={toggleFavorite}
  />
  <Superbar
    actions={actions3}
    title="With one action and one toggle"
    reversed
    on:share={() => console.log('Share action clicked!')}
    on:favorite={toggleHeart}
  />

  <Superbar
    actions={actions4}
    title="With more than two actions"
    on:share={() => console.log('Share action clicked!')}
    on:settings={() => console.log('Settings action clicked!')}
    on:add={() => console.log('Add action clicked!')}
    on:edit={() => console.log('Edit action clicked!')}
  />
</section>

<style>
  section {
    border: 1px solid #ccc;
    width: 500px;
    min-height: 800px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
</style>

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
  import { goto } from '$app/navigation';
  import { Button, Text } from '@soliguide/design-system';
  import { themeStore } from '$lib/theme';
  import { ROUTES_CTX_KEY } from '$lib/client';
  import { getContext } from 'svelte';
  import { get } from 'svelte/store';
  import type { ThemeDefinition } from '$lib/theme/types';
  import type { RoutingStore } from '$lib/client/types';

  const theme: ThemeDefinition = get(themeStore.getTheme());
  const routes: RoutingStore = getContext(ROUTES_CTX_KEY);

  const skip = (): void => {
    goto($routes.ROUTE_HOME);
  };

  const next = (): void => {
    console.log('Go next page');
  };
</script>

<section>
  <div class="onboarding-header">
    <img src={`/images/${theme.media.logos.original}`} alt="onboarding illustration" />
    <span class="title">
      <Text type="title1PrimaryExtraBold" as="h1">Le guide de la solidarité en ligne</Text>
    </span>
  </div>
  <div class="onboarding-footer">
    <Button on:click={next}>Voir comment ça fonctionne</Button>
    <Button type="neutralOutlined" on:click={skip}>Passer</Button>
  </div>
</section>

<style lang="scss">
  section {
    height: 100vh;
    padding: 256px var(--spacingMD) var(--spacing4XL);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .onboarding-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacingXL);

    img {
      width: 70%;
      max-width: 300px;
    }
  }
  .title {
    text-align: center;
    display: inline-block;
    max-width: 250px;
  }
  .onboarding-footer {
    display: flex;
    flex-direction: column;
    gap: var(--spacingLG);
  }
</style>

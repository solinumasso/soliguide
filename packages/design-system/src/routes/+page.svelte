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
  import i18n from '$lib/i18n';
  import ThemeContext from '$lib/theme/ThemeContext.svelte';
  import Text from '$lib/components/Text.svelte';
  import ThemeSwitcher from './ThemeSwitcher.svelte';
</script>

<svelte:head>
  <title>Design system</title>
</svelte:head>

<ThemeContext>
  <section>
    <Text type="display1">Welcome to the design system</Text>
    <Text as="p">You can use this page as a playground to test components.</Text>
    <Text as="p">
      Test translation key: CLOSE = {$i18n.t('CLOSE')}
    </Text>
    <p></p>
    <Text as="p"><a href="/">this is a sample link</a></Text>

    <div style="display: flex;gap:15px;margin:15px 0">
      <div class="color-token hl1"><Text>color: interactionHighlightPrimary</Text></div>
      <div class="color-token hl1hover"><Text>color: interactionHighlightPrimaryHover</Text></div>
      <div class="color-token hl2"><Text>color: interactionHighlightSecondary</Text></div>
      <div class="color-token hl2hover"><Text>color: interactionHighlightSecondaryHover</Text></div>
    </div>

    <ThemeSwitcher />
  </section>
</ThemeContext>

<style lang="scss">
  @import '../lib/styles/variables.scss';
  $color-test: cornflowerblue;
  p {
    color: $color-test;
    display: flex;
    align-items: center;
  }
  .color-token {
    border: 1px solid black;
    padding: 10px;
    &.hl1 {
      background-color: var(--color-interactionHighlightPrimary);
    }
    &.hl1hover {
      background-color: var(--color-interactionHighlightPrimaryHover);
    }
    &.hl2 {
      background-color: var(--color-interactionHighlightSecondary);
      color: white;
    }
    &.hl2hover {
      background-color: var(--color-interactionHighlightSecondaryHover);
      color: white;
    }
  }
</style>

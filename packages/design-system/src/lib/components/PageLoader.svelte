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
  import Spinner from './Spinner.svelte';

  export let loading = false;
  export let fullPage = false;
</script>

{#if loading}
  <section class="loader" class:full-page={fullPage}>
    <Spinner type="primaryWithBackground" />
  </section>
{:else}
  <slot />
{/if}

<style lang="scss">
  .loader {
    display: flex;
    justify-content: center;
    padding-top: var(--spacingLG);

    &.full-page {
      padding-top: var(--spacing2XL);
    }
  }
</style>

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
  import { createEventDispatcher } from 'svelte';
  import ChevronLeft from 'svelte-google-materialdesign-icons/Chevron_left.svelte';
  import type { TopbarType } from '$lib/types/TopBar';
  import type { ButtonType } from '$lib/types/Button';
  import Button from '$lib/components/buttons/Button.svelte';
  import Text from '$lib/components/Text.svelte';

  export let title = '';

  export let type: TopbarType = 'gradient';
  export let navigateBackAriaLabel = 'Back';

  const buttonTypeMapping: Record<TopbarType, ButtonType> = {
    gradient: 'shy',
    reversedGradient: 'reversed',
    transparent: 'shy',
    reversedTransparent: 'reversed'
  };

  const buttonTypeColorMapping: Record<TopbarType, string> = {
    gradient: 'bg-gradientBackground text-dark',
    reversedGradient: 'bg-gradientSecondary text-inverse',
    transparent: 'text-dark',
    reversedTransparent: 'text-inverse'
  };

  const dispatch = createEventDispatcher<{ navigate: null }>();
</script>

<!-- IN V2, to include the buttons, check what was done in src/routes/actions/+page.svelte with actions buttons -->
<nav
  class={`fixed top-0 left-0 w-screen z-[1] flex items-center overflow-hidden h-topbar-height px-lg ${buttonTypeColorMapping[type]}`}
>
  <Button
    type={buttonTypeMapping[type]}
    iconPosition="iconOnly"
    aria-label={navigateBackAriaLabel}
    title={navigateBackAriaLabel}
    on:click={() => dispatch('navigate')}
  >
    <ChevronLeft slot="icon" />
  </Button>

  <div class="flex-1 text-center">
    <Text type="title3PrimaryExtraBold">{title}</Text>
  </div>
</nav>

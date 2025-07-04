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
  import { getContext, type SvelteComponent, type ComponentType } from 'svelte';

  import CheckCircle from 'svelte-google-materialdesign-icons/Check_circle.svelte';
  import Info from 'svelte-google-materialdesign-icons/Info.svelte';
  import Warning from 'svelte-google-materialdesign-icons/Warning.svelte';
  import GppBad from 'svelte-google-materialdesign-icons/Gpp_bad.svelte';
  import type { ThemeContext } from '$lib/types/theme.d.ts';
  import type { InfoIconSize, InfoIconVariant } from '$lib/types/InfoIcon.d.ts';

  export let variant: InfoIconVariant = 'info';
  export let size: InfoIconSize = 'small';
  export let withShadow = true;
  export let altTag = '';

  const { theme } = getContext<ThemeContext>('theme');

  const variantMapping: Record<
    InfoIconVariant,
    { icon: ComponentType<SvelteComponent>; color: string }
  > = {
    info: { icon: Info, color: $theme.color.textHighlightSecondary },
    success: { icon: CheckCircle, color: $theme.color.textSuccess },
    warning: { icon: Warning, color: $theme.color.textWarning },
    error: { icon: GppBad, color: $theme.color.textError }
  };
  const defaultVariantMapping = variantMapping.info;

  $: sizeClass = size === 'medium' ? 'info-icon-medium' : 'info-icon-small';
  $: cls = `info-icon ${sizeClass}`;
  $: icon = variantMapping[variant].icon ?? defaultVariantMapping.icon;
  $: color = variantMapping[variant].color ?? defaultVariantMapping.color;
  $: iconSize = size === 'medium' ? 16 : 12;
</script>

<span class={cls} class:with-shadow={withShadow}>
  <svelte:component this={icon} alt={altTag} variation="filled" size={iconSize} {color} />
</span>

<style lang="scss">
  .info-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-surfaceWhite);
    border-radius: var(--radiusFull);

    &.with-shadow {
      box-shadow: var(--shadowXS);
    }

    &.info-icon-small {
      $size: 16px;
      height: $size;
      width: $size;
    }

    &.info-icon-medium {
      $size: 24px;
      height: $size;
      width: $size;
    }
  }
</style>

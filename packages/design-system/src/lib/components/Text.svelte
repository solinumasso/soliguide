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
  import type { TextColor, TextTag, TextType } from '$lib/types/Text';

  /** Overrides the HTML tag that will be used fot this text */
  export let as: TextTag | null = null;
  export let type: TextType = 'text1';
  export let color: TextColor | null = null;
  export let ellipsis = false;

  // Mapping between the type, the tag and the css class
  const textMapping: Record<TextType, { tag?: TextTag; cls: string }> = {
    display1: { tag: 'h1', cls: 'text-primary-display1-extrabold' },
    display2: { tag: 'h2', cls: 'text-primary-display2-extrabold' },
    title1PrimaryExtraBold: { tag: 'h1', cls: 'text-primary-title1-extrabold' },
    title2PrimaryExtraBold: { tag: 'h2', cls: 'text-primary-title2-extrabold' },
    title3PrimaryExtraBold: { tag: 'h3', cls: 'text-primary-title3-extrabold' },
    title4PrimaryExtraBold: { tag: 'h4', cls: 'text-primary-title4-extrabold' },
    title1PrimaryBold: { tag: 'h1', cls: 'text-primary-title1-bold' },
    title2PrimaryBold: { tag: 'h2', cls: 'text-primary-title2-bold' },
    title3PrimaryBold: { tag: 'h3', cls: 'text-primary-title3-bold' },
    title4PrimaryBold: { tag: 'h4', cls: 'text-primary-title4-bold' },
    title1SecondaryBold: { tag: 'h1', cls: 'text-secondary-title1-bold' },
    title2SecondaryBold: { tag: 'h2', cls: 'text-secondary-title2-bold' },
    text1: { cls: 'text-secondary-text1-regular' },
    text2: { cls: 'text-secondary-text2-regular' },
    text1Medium: { cls: 'text-secondary-text1-medium' },
    text2Medium: { cls: 'text-secondary-text2-medium' },
    text1Bold: { cls: 'text-secondary-text1-bold' },
    text2Bold: { cls: 'text-secondary-text2-bold' },
    caption1: { cls: 'text-secondary-caption1-regular' },
    caption2: { cls: 'text-secondary-caption2-regular' },
    caption1Medium: { cls: 'text-secondary-caption1-medium' },
    caption2Medium: { cls: 'text-secondary-caption2-medium' },
    caption1Bold: { cls: 'text-secondary-caption1-bold' },
    caption2Bold: { cls: 'text-secondary-caption2-bold' }
  };

  const colorMapping: Record<TextColor, string> = {
    dark: 'text-color-dark',
    neutral: 'text-color-neutral',
    shy: 'text-color-shy',
    inverse: 'text-color-inverse',
    highlightPrimary: 'text-color-highlight-primary',
    highlightPrimary2: 'text-color-highlight-primary2',
    highlightSecondary: 'text-color-highlight-secondary',
    highlightSecondary2: 'text-color-highlight-secondary2',
    highlightTertiary: 'text-color-highlight-tertiary',
    highlightQuartary: 'text-color-highlight-quartary',
    focus: 'text-color-text-focus',
    success: 'text-color-success',
    warning: 'text-color-warning',
    error: 'text-color-error'
  };

  // Make sure text has always a valid style
  $: if (!textMapping[type]) {
    console.log(`Text has no type '${type}'. Using 'text1'`);
  }
  $: textDefinition = textMapping[type] || textMapping.text1;
  $: cssClass = `${textDefinition.cls} ${color ? colorMapping[color] : ''} ${ellipsis ? 'ellipsis' : ''}`;
  $: tag = as || textDefinition.tag || 'span';
</script>

<svelte:element this={tag} class={cssClass}>
  <slot />
</svelte:element>

<style>
  /* .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  } */
</style>

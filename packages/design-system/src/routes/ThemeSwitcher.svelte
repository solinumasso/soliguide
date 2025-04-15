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
  import { getContext } from 'svelte';
  import { theme as defaultTheme } from '$lib/theme/theme';
  import Button from '$lib/components/buttons/Button.svelte';
  import type { ThemeContext, ThemeColor, Theme } from '$lib/types/theme';

  // Modify before using cause the ThemeContext doesn't exist anymore
  const { theme: currentTheme, setTheme } = getContext<ThemeContext>('theme');

  // Other set of colors
  const alternativeColors: ThemeColor = {
    // Interaction
    interactionHighlightPrimary: '#9ADD76',
    interactionHighlightPrimaryHover: '#75C14C',
    interactionHighlightPrimaryPress: '#5C973C',
    interactionHighlightSecondary: '#AE3A4F',
    interactionHighlightSecondaryHover: '#872D3D',
    interactionHighlightSecondaryPress: '#67222F',
    interactionNeutral: '#262626',
    interactionNeutralHover: '#67222F',
    interactionNeutralPress: '#3A3E45',
    interactionOutlined: '#FFFFFF',
    interactionOutlinedHover: '#F3F4F6',
    interactionOutlinedPress: '#DADEE3',
    interactionOutlinedSecondary: '#FFFFFF',
    interactionOutlinedSecondaryHover: '#FEEEF1',
    interactionOutlinedSecondaryPress: '#B2C1EF',
    interactionOutlinedSecondaryActive: '#AE3A4F',
    interactionOutlinedSecondaryActiveHover: '#872D3D',
    interactionOutlinedSecondaryActivePress: '#67222F',
    interactionReversed: '#ffffff',
    interactionReversedHover: '#D8F2CA',
    interactionReversedPress: '#C5EBB0',
    interactionReversedActive: '#FF4124',
    interactionReversedActiveHover: '#75C14C',
    interactionReversedActivePress: '#5C973C',
    interactionDisable: '#DADEE3',
    // Text
    textDark: '#4B515B',
    textNeutral: '#7D8696',
    textShy: '#A1A9B7',
    textInverse: '#ffffff',
    textHighlightPrimary: '#9ADD76',
    // To determine cause same as default
    textHighlightPrimary2: '#c8260d',
    textHighlightSecondary: '#AE3A4F',
    // To determine cause same as default
    textHighlightSecondary2: '#271332',
    textHighlightTertiary: '#6A3177',
    textHighlightQuartary: '#784034',
    textFocus: '#F5516F',
    textSuccess: '#75CF99',
    textWarning: '#CA8A04',
    textError: '#FF4D4F',
    // Surfaces
    surfaceWhite: '#ffffff',
    surfaceWhiteAlphaLight: 'rgba(255, 255, 255, 0.20)',
    surfaceWhiteAlphaStrong: 'rgba(255, 255, 255, 0.4)',
    overlayLight: 'rgba(38, 38, 38, 0.4)',
    overlayStrong: 'rgba(38, 38, 38, 0.6)',
    //To determine cause same as default
    overlayVeryStrong: 'rgba(38, 38, 38, 0.7)',
    surfacePrimary1: '#FFFFFF',
    surfacePrimary2: '#F2FBEE',
    surfacePrimary3: '#D8F2CA',
    // To determine cause same as default
    surfacePrimary4: '#fa6d56',
    // To determine cause same as default
    surfacePrimary5: '#ed3215',
    surfaceSecondary1: '#FFFFFF',
    surfaceSecondary2: '#FEEEF1',
    surfaceSecondary3: '#FCC9D2',
    surfaceSecondaryGradient: 'linear-gradient(270deg, #424291 0%, #7981db 100%)',
    surfaceTertiary1: '#F6EDFA',
    // To determine cause same as default
    surfaceTertiary2: '#e5e7fd',
    // To determine cause same as default
    surfaceTertiary3: '#cfd9f6',
    // To determine cause same as default
    surfaceTertiary4: '#5e5ecd',
    // To determine cause same as default
    surfaceTertiaryGradient: 'linear-gradient(270deg, #504EB4 0%, #3B3D74 100%)',
    surfaceQuartary1: '#f5ebe1',
    surfaceGray1: '#FFFFFF',
    surfaceGray2: '#F3F4F6',
    surfaceGray3: '#DADEE3',
    surfaceSuccess1: '#CAECD8',
    surfaceSuccess2: '#B0E3C5',
    surfaceError1: '#FFCCC7',
    surfaceError2: '#FFA39E',
    surfaceWarning1: '#FDE047',
    surfaceWarning2: '#FEF9C3',
    // Borders
    borderNeutral: '#DADEE3',
    borderFocus: '#F5516F',
    borderCompleted: '#4B515B',
    borderSuccess: '#75CF99',
    borderError: '#FF4D4F',
    // Gradients
    gradientPrimary: 'linear-gradient(270deg, #9ADD76 0%, #fa6d56 100%)',
    gradientSecondary: 'linear-gradient(270deg, #AE3A4F 0%, #7981db 100%)',
    // To determine
    gradientTertiary: 'linear-gradient(270deg, #613677 0%, #463351 100%)',
    gradientBackground:
      'radial-gradient(104.32% 140.38% at 0% 0%, #F6F5FF 0%, #F7F3F7 50%, #FFF 100%)',
    // Misc
    appBackground: '#E5E5E5'
  };

  const otherTheme: Theme = {
    ...defaultTheme,
    color: alternativeColors
  };
</script>

<Button on:click={() => setTheme(defaultTheme)}>switch default theme</Button>
<Button on:click={() => setTheme(otherTheme)}>switch other theme</Button>

<pre>Current theme: {JSON.stringify($currentTheme, null, 2)}</pre>

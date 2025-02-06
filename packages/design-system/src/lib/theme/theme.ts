/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// Default Solinum theme: semantic variables
export const theme = {
  color: {
    // Interaction
    interactionHighlightPrimary: '#ff4124',
    interactionHighlightPrimaryHover: '#C8260D',
    interactionHighlightPrimaryPress: '#A5230F',
    interactionHighlightSecondary: '#424291',
    interactionHighlightSecondaryHover: '#3B3D74',
    interactionHighlightSecondaryPress: '#1F1F3D',
    interactionNeutral: '#262626',
    interactionNeutralHover: '#1F1F3D',
    interactionNeutralPress: '#171717',
    interactionOutlined: '#FFFFFF',
    interactionOutlinedHover: '#F5F5F5',
    interactionOutlinedPress: '#E5E5E5',
    interactionOutlinedSecondary: '#FFFFFF',
    interactionOutlinedSecondaryHover: '#E5E7FD',
    interactionOutlinedSecondaryPress: '#B2C1EF',
    interactionOutlinedSecondaryActive: '#424291',
    interactionOutlinedSecondaryActiveHover: '#3B3D74',
    interactionOutlinedSecondaryActivePress: '#1F1F3D',
    interactionReversed: '#ffffff',
    interactionReversedHover: '#FFEFEC',
    interactionReversedPress: '#FFCBC9',
    interactionReversedActive: '#FF4124',
    interactionReversedActiveHover: '#C8260D',
    interactionReversedActivePress: '#A5230F',
    interactionDisable: '#e5e5e5',
    // Text
    textDark: '#171717',
    textNeutral: '#404040',
    textShy: '#737373',
    textInverse: '#ffffff',
    textHighlightPrimary: '#ff4124',
    textHighlightSecondary: '#424291',
    textHighlightTertiary: '#6A3177',
    textHighlightQuartary: '#784034',
    textFocus: '#5e5ecd',
    textSuccess: '#059669',
    textWarning: '#CA8A04',
    textError: '#ef4444',
    // Surfaces
    surfaceWhite: '#ffffff',
    surfaceWhiteAlphaLight: 'rgba(255, 255, 255, 0.20)',
    surfaceWhiteAlphaStrong: 'rgba(255, 255, 255, 0.4)',
    overlayLight: 'rgba(38, 38, 38, 0.4)',
    overlayStrong: 'rgba(38, 38, 38, 0.6)',
    surfacePrimary1: '#FFF3F3',
    surfacePrimary2: '#FFEFEC',
    surfacePrimary3: '#FA6D56',
    surfaceSecondary1: '#f6f5ff',
    surfaceSecondary2: '#e5e7fd',
    surfaceSecondary3: '#cfd9f6',
    surfaceSecondary4: '#5e5ecd',
    surfaceSecondaryGradient: 'linear-gradient(270deg, #424291 0%, #7981db 100%)',
    surfaceTertiary1: '#F6EDFA',
    surfaceQuartary1: '#F5EBE1',
    surfaceGray1: '#E5E5E5',
    surfaceGray2: '#262626',
    surfaceGray3: '#F5F5F5',
    surfaceSuccess1: '#6EE7B7',
    surfaceSuccess2: '#D1FAE5',
    surfaceError1: '#FCA5A5',
    surfaceError2: '#FEE2E2',
    surfaceWarning1: '#FDE047',
    surfaceWarning2: '#FEF9C3',
    // Borders
    borderNeutral: '#e5e5e5',
    borderFocus: '#5e5ecd',
    borderCompleted: '#171717',
    borderSuccess: '#10b981',
    borderError: '#ef4444',
    // Gradients
    gradientPrimary: 'linear-gradient(270deg, #ff4124 0%, #fa6d56 100%)',
    gradientSecondary: 'linear-gradient(270deg, #424291 0%, #7981db 100%)',
    gradientBackground:
      'radial-gradient(104.32% 140.38% at 0% 0%, #F6F5FF 0%, #F7F3F7 50%, #FFF 100%)',
    // Misc
    appBackground: '#E5E5E5'
  },
  typography: {
    // Families
    fontFamilyPrimary: 'Nunito',
    fontFamilySecondary: 'Roboto',
    // Sizes
    fontSizeDisplay1: '40px',
    fontSizeDisplay2: '32px',
    fontSizeTitle1: '24px',
    fontSizeTitle2: '20px',
    fontSizeTitle3: '18px',
    fontSizeTitle4: '16px',
    fontSizeText1: '16px',
    fontSizeText2: '14px',
    fontSizeCaption1: '12px',
    fontSizeCaption2: '10px',
    // Line heights
    lineHeightDisplay1: '48px',
    lineHeightDisplay2: '40px',
    lineHeightTitle1: '32px',
    lineHeightTitle2: '32px',
    lineHeightTitle3: '24px',
    lineHeightTitle4: '24px',
    lineHeightText1: '24px',
    lineHeightText2: '18px',
    lineHeightCaption1: '18px',
    lineHeightCaption2: '12px',
    // Weights
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    fontWeightExtrabold: 800
  },
  spacing: {
    spacing4XS: '0.125rem', // 2px
    spacing3XS: '0.25rem', // 4px
    spacing2XS: '0.375rem', // 6px
    spacingXS: '0.5rem', // 8px
    spacingSM: '0.625rem', // 10px
    spacingMD: '0.875rem', // 14px
    spacingLG: '1rem', // 16px
    spacingXL: '1.5rem', // 24px
    spacing2XL: '2rem', // 32px
    spacing3XL: '3rem', // 48px
    spacing4XL: '4rem', // 64px
    spacing5XL: '6rem', // 96px
    spacing6XL: '16rem' // 256px
  },
  radius: {
    radiusMinimal: '2px',
    radiusMiddle: '6px',
    radiusRounded: '12px',
    radiusFull: '999px'
  },
  shadow: {
    shadowNone: '0px 0px 0px 0px #000',
    shadowXS: '2px 2px 4px -4px rgba(23, 23, 23, 0.4)',
    shadowMD: '4px 8px 16px -12px rgba(23, 23, 23, 0.2)',
    shadowLG: '8px 16px 48px -20px rgba(23, 23, 23, 0.4)',
    shadowXL: '12px 20px 48px -12px rgba(23, 23, 23, 0.4)',
    shadow2XL: '20px 24px 64px -16px rgba(23, 23, 23, 0.6)',
    shadowInner: '0px 4px 16px -8px rgba(23, 23, 23, 0.3) inset'
  }
};

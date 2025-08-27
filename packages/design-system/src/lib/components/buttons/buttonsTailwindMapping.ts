/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { ButtonSize, ButtonType } from '$lib/types/Button';
import type { SpinnerSize } from '$lib/types/Spinner';

// Base classes shared by all buttons
const baseClasses =
  'relative inline-flex items-center justify-center flex-shrink-0 cursor-pointer whitespace-nowrap font-secondary border  focus:outline-none disabled:cursor-not-allowed no-underline hover:no-underline';

// Icon sizes mapping
const iconSizeMapping: Record<ButtonSize, { width: string; height: string }> = {
  xsmall: { width: 'w-4', height: 'h-4' },
  small: { width: 'w-5', height: 'h-5' },
  medium: { width: 'w-[22px]', height: 'h-[22px]' },
  large: { width: 'w-6', height: 'h-6' }
};

// Size classes mapping with correct height, padding, and minimum width
const sizeMapping: Record<ButtonSize, string> = {
  xsmall: 'h-6 min-w-6 px-md text-secondary-caption1-bold rounded-middle',
  small: 'h-8 min-w-sm px-lg text-secondary-text2-bold rounded-middle',
  medium: 'h-10 min-w-10 px-xl text-secondary-text1-bold rounded-middle',
  large: 'h-[52px] min-w-[52px] px-2xl text-secondary-text1-bold rounded-rounded'
};

// Classes for each button type with complete hover, active and focus states
const typeMapping: Record<ButtonType, string> = {
  primaryFill:
    'bg-interactionHighlightPrimary border-transparent text-highlightSecondary2 hover:bg-interactionHighlightPrimaryHover active:bg-interactionHighlightPrimaryPress active:text-inverse focus-visible:bg-interactionHighlightPrimaryPress focus-visible:text-inverse',
  primaryGradientFill:
    'bg-gradientPrimary text-highlightSecondary2 border-transparent hover:bg-interactionHighlightPrimaryHover active:bg-interactionHighlightPrimaryPress active:text-inverse focus-visible:bg-interactionHighlightPrimaryPress focus-visible:text-inverse',
  primaryOutline:
    'bg-interactionOutlined border-interactionHighlightPrimary text-interactionHighlightPrimary hover:bg-interactionOutlinedHover hover:text-interactionHighlightPrimaryHover hover:border-interactionHighlightPrimaryHover active:text-interactionHighlightPrimaryPress active:border-interactionHighlightPrimaryPress active:bg-interactionOutlinedPress [&.btn-icon]:border-borderNeutral hover:[&.btn-icon]:border-interactionDisable active:[&.btn-icon]:border-interactionDisable',
  neutralFill:
    'bg-interactionNeutral border-transparent text-inverse hover:bg-interactionNeutralHover active:bg-interactionNeutralPress focus-visible:bg-interactionNeutralPress',
  neutralOutlined:
    'bg-transparent border-interactionNeutral text-interactionNeutral hover:bg-interactionOutlinedHover active:text-interactionNeutralPress active:border-interactionNeutralPress active:bg-interactionOutlinedPress [&.btn-icon]:border-borderNeutral hover:[&.btn-icon]:border-interactionDisable active:[&.btn-icon]:border-interactionDisable',
  shy: 'bg-transparent border-transparent text-highlightSecondary2 hover:bg-interactionReversedHover active:text-dark active:bg-interactionReversedPress focus-visible:text-dark focus-visible:bg-interactionReversedPress',
  reversed:
    'bg-transparent text-interactionReversed border-interactionReversed [&.btn-icon]:border-transparent hover:text-interactionReversedActiveHover hover:bg-interactionReversedHover active:text-interactionReversedActivePress active:bg-interactionReversedPress focus-visible:text-interactionReversedActivePress focus-visible:bg-interactionReversedPress'
};

// Classes for disabled states with complete styling
const disabledClasses: Record<ButtonType, string> = {
  primaryFill: 'bg-interactionDisable text-shy border-none shadow-none',
  primaryGradientFill: 'bg-interactionDisable text-shy border-none shadow-none',
  primaryOutline: 'border-interactionDisable text-shy bg-transparent',
  neutralFill: 'bg-interactionDisable text-shy border-none shadow-none',
  neutralOutlined: 'border-interactionDisable text-shy bg-transparent',
  shy: 'text-shy bg-transparent',
  reversed: 'text-shy bg-transparent border-transparent'
};

// Spinner size mapping
const spinnerSizeMapping: Record<ButtonSize, SpinnerSize> = {
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'medium'
};

export {
  baseClasses,
  sizeMapping,
  typeMapping,
  disabledClasses,
  spinnerSizeMapping,
  iconSizeMapping
};

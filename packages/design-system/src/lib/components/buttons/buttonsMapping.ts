import type { SpinnerSize } from '$lib/types/Spinner';
import type { ButtonSize, ButtonType } from '$lib/types/Button';

// Avoid sticking to prop values
const sizeMapping: Record<ButtonSize, string> = {
  xsmall: 'btn-xsmall',
  small: 'btn-small',
  medium: 'btn-medium',
  large: 'btn-large'
};

const typeMapping: Record<ButtonType, string> = {
  primaryFill: 'btn-primary',
  primaryGradientFill: 'btn-primary-gradient',
  primaryOutline: 'btn-primary-outline', // Only for icon buttons
  neutralFill: 'btn-neutral',
  neutralOutlined: 'btn-neutral-outline',
  shy: 'btn-shy',
  reversed: 'btn-reversed'
};

const spinnerSizeMapping: Record<ButtonSize, SpinnerSize> = {
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'medium'
};

export { typeMapping, spinnerSizeMapping, sizeMapping };

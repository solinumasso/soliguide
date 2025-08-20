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
  import type { SpinnerSize, SpinnerType } from '$lib/types/Spinner';

  export let size: SpinnerSize = 'medium';
  export let type: SpinnerType = 'primary';

  const sizeMapping: Record<SpinnerSize, string> = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  const typeMapping: Record<SpinnerType, string> = {
    primary: 'spinner-primary',
    primaryWithBackground: 'spinner-primary-background',
    neutral: 'spinner-neutral',
    neutralWithBackground: 'spinner-neutral-background',
    reversed: 'spinner-reversed',
    reversedWithBackground: 'spinner-reversed-background'
  };

  $: spinnerClass = `spinner ${sizeMapping[size]} ${typeMapping[type]}`;
</script>

<div class={spinnerClass}></div>

<style>
  /* .spinner {
    display: block;
    border-radius: 50%;
    position: relative;
    transform: rotate(135deg);
  }
  .spinner::before {
    content: '';
    position: absolute;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    border: 1px solid;
    animation: loading 1s infinite linear;
  }*/

  /* Tailles du spinner */
  /*.spinner-small {
    width: 24px;
    height: 24px;
    padding: var(--spacing3XS);
    &:before {
      margin: -8px 0 0 -8px;
      width: 16px;
      height: 16px;
      border-width: 1px;
    }
  }

  .spinner-medium {
    width: 36px;
    height: 36px;
    padding: var(--spacing2XS);
    &:before {
      margin: -12px 0 0 -12px;
      width: 24px;
      height: 24px;
      border-width: 2px;
    }
  }

  .spinner-large {
    width: 48px;
    height: 48px;
    padding: var(--spacingXS);
    &:before {
      margin: -16px 0 0 -16px;
      width: 32px;
      height: 32px;
      border-width: 3px;
    }
  } */

  /* Variantes de fond */
  /*.spinner-primary::before {
    border-color: var(--color-textHighlightPrimary);
  }

  .spinner-primary-background {
    background-color: var(--color-textInverse);
    box-shadow: var(--shadowXS);
    &:before {
      border-color: var(--color-textHighlightPrimary);
    }
  }

  .spinner-neutral::before {
    border-color: var(--color-textHighlightSecondary2);
  }

  .spinner-neutral-background {
    background-color: var(--color-textInverse);
    box-shadow: var(--shadowXS);
    &:before {
      border-color: var(--color-textHighlightSecondary2);
    }
  }

  .spinner-reversed::before {
    border-color: var(--color-textInverse);
  }

  .spinner-reversed-background {
    background-color: var(--color-surfacePrimary5);
    box-shadow: var(--shadowXS);
    &:before {
      border-color: var(--color-textInverse);
    }
  }

  @keyframes loading {
    0%,
    100% {
      clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
    }
    10% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
    }
    20% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
    }
    30% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
    }
    40% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
    }
    50% {
      clip-path: polygon(50% 50%, 100% 0, 100% 0, 100% 100%, 0 100%, 0 0);
    }
    60% {
      clip-path: polygon(50% 50%, 100% 100%, 100% 100%, 100% 100%, 0 100%, 0 0);
    }
    70% {
      clip-path: polygon(50% 50%, 0 100%, 0 100%, 0 100%, 0 100%, 0 0);
    }
  } */
</style>

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
  import Text from '$lib/components/Text.svelte';
  import TextClamper from '$lib/components/dataDisplay/TextClamper.svelte';
  import InfoIcon from '$lib/components/InfoIcon.svelte';
  import type { InfoBlockVariant } from '$lib/types/InfoBlock';
  import type { InfoIconVariant } from '$lib/types/InfoIcon';
  import ButtonLink from '../buttons/ButtonLink.svelte';
  import Button from '../buttons/Button.svelte';

  export let variant: InfoBlockVariant = 'info';
  export let withIcon = false;
  export let title: string | null = null;
  export let text: string;
  export let withClamp = false;
  export let withButton = false;
  export let withButtonLink = false;
  export let buttonLabel = '';
  export let buttonLinkLabel = '';
  export let buttonLinkHref = '';

  const variantMapping: Record<InfoBlockVariant, InfoIconVariant> = {
    info: 'info',
    success: 'success',
    warning: 'warning',
    error: 'error'
  };

  $: withTitle = !!title;
  $: iconVariant = variantMapping[variant] ?? variantMapping.info;
  $: cls = `infoblock infoblock-${variantMapping[variant] ?? variantMapping.info}`;

  $: showClampedText = withClamp && !withButton && !withButtonLink;
  $: showButton = withButton && !withClamp;
  $: showButtonLink = withButtonLink && !withClamp;
</script>

<article class={cls}>
  {#if withIcon && !withTitle}
    <div class="infoblock-left-panel"><InfoIcon variant={iconVariant} size="medium" /></div>
  {/if}
  <div class="infoblock-column-container">
    {#if withTitle}
      <header>
        {#if withIcon}<InfoIcon variant={iconVariant} size="small" />{/if}
        <Text type="text2Medium" as="h1">{title}</Text>
      </header>
    {/if}

    {#if showClampedText}
      <TextClamper
        linesNotClamped={2}
        showMoreLabel={$i18n.t('SEE_MORE')}
        showLessLabel={$i18n.t('SEE_LESS')}
      >
        <Text type="caption1" as="p">{text}</Text>
      </TextClamper>
    {:else}
      <Text type="caption1" as="p">{text}</Text>
    {/if}

    {#if showButton}
      <div class="infoblock-button">
        <Button type="neutralOutlined" size="xsmall">{buttonLabel}</Button>
      </div>
    {/if}

    {#if showButtonLink}
      <div class="infoblock-button">
        <ButtonLink type="neutralOutlined" href={buttonLinkHref} size="xsmall"
          >{buttonLinkLabel}</ButtonLink
        >
      </div>
    {/if}
  </div>
</article>

<style lang="scss">
  .infoblock {
    display: flex;
    border-radius: var(--radiusMiddle);
    padding: var(--spacingSM);
    gap: var(--spacingXS);

    header {
      display: flex;
      gap: var(--spacing3XS);
    }

    .infoblock-column-container {
      flex-direction: column;
    }

    .infoblock-button {
      display: flex;
      justify-content: center;
      padding-top: var(--spacingXS);
    }
  }

  .infoblock-info {
    background-color: var(--color-surfaceTertiary2);
  }
  .infoblock-success {
    background-color: var(--color-surfaceSuccess2);
  }
  .infoblock-warning {
    background-color: var(--color-surfaceWarning2);
  }
  .infoblock-error {
    background-color: var(--color-surfaceError2);
  }
</style>

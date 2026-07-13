<script lang="ts">
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { TextClamper } from '@soliguide/design-system';
  import { getContext } from 'svelte';
  import DOMPurify from 'dompurify';
  import { type PlaceDetailsInfo, type TranslatableElement } from '$lib/models/types';
  import type { I18nStore } from '$lib/client/types';
  import { getTitleAndIcon } from '../functions';

  export let info: PlaceDetailsInfo[] = [];

  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  const getFormattedDescription = (description: TranslatableElement[]): string => {
    return description.map(({ key, params }) => $i18n.t(key, params)).join(', ');
  };
</script>

<div class="info-content">
  {#each info as { type, description, needTranslation, translatedText }}
    {@const details = getTitleAndIcon($i18n, type)}
    <div class="detail">
      <div class="icon">
        <svelte:component this={details.icon} size="18" />
      </div>

      <p class="public-description">
        {#if !needTranslation && translatedText}
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html DOMPurify.sanitize(translatedText)}
        {:else}
          <b>{details.title}</b>
          <TextClamper
            linesNotClamped={3}
            showMoreLabel={$i18n.t('SEE_MORE')}
            showLessLabel={$i18n.t('SEE_LESS')}
          >
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html DOMPurify.sanitize(getFormattedDescription(description))}
          </TextClamper>
        {/if}
      </p>
    </div>
  {/each}
</div>

<style lang="scss">
  .public-description {
    font-size: 0.7rem;
    font-style: normal;
    line-height: 1.2rem;
    color: var(--color-textShy);
  }
  .public-description :global(b) {
    display: block !important;
    color: black;
    font-size: 15px;
    font-size: 0.85rem;
  }
  .info-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacingLG);
  }

  .detail {
    display: flex;
    gap: var(--spacingMD);
  }

  .icon {
    height: 16px;
    width: 16px;
    color: var(--color-textDark);
  }
</style>

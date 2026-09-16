<script lang="ts">
  import { getContext } from 'svelte';
  import { Tag } from '@soliguide/design-system';
  import type { Modalities } from '@soliguide/common';
  import { getEmergencyContext } from '$lib/emergency';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import type { I18nStore } from '$lib/client/types';

  export let modalities: Modalities;

  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  // Static configuration, but the country it is matched against comes from the
  // request-scoped theme, so the lookup belongs here rather than at module scope.
  const tagRule = getEmergencyContext()?.tag ?? null;

  $: tag = tagRule?.resolve({ modalities }) ?? null;
</script>

{#if tagRule && tag}
  <Tag variant={tag.variant}>
    <svelte:component this={tagRule.icon} slot="icon" aria-hidden="true" />
    {$i18n.t(tag.translationKey)}
  </Tag>
{/if}

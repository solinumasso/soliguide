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

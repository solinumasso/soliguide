<script lang="ts">
  import { getContext, hasContext, onDestroy } from 'svelte';

  import ExpandMoreOrLess from 'svelte-google-materialdesign-icons/Expand_more.svelte';

  import Text from '$lib/components/Text.svelte';
  import Button from '$lib/components/buttons/Button.svelte';
  import { contextKey } from '$lib/components/dataDisplay/Accordion/contextKey';
  import { generateId } from '$lib/id';
  import type { AccordionContext } from '$lib/types/Accordion';
  import type { ThemeContext } from '$lib/types/theme';
  import type { Writable } from 'svelte/store';
  import type { TextColor } from '$lib/types/Text';

  export let title: string;
  export let isExpanded = false;
  export let disabled = false;
  export let shy = false;
  export let key: string;

  const { theme } = getContext<ThemeContext>('theme');

  let toggleAccordion = () => {
    isExpanded = !isExpanded;
  };

  if (!key) {
    key = generateId();
  }

  let state: Writable<Map<string, boolean>>;

  if (hasContext(contextKey)) {
    const context = getContext<AccordionContext>(contextKey);
    const { toggleExpand, register } = context;
    ({ state } = context);
    toggleAccordion = () => {
      toggleExpand(key);
    };
    register(key, isExpanded);

    const unsubscribe = state.subscribe((map) => {
      isExpanded = map.get(key)!;
    });
    onDestroy(unsubscribe);
  }

  const getTextColor = (): TextColor => {
    return disabled ? 'shy' : 'dark';
  };

  $: textColor = getTextColor();
  $: iconColor = disabled ? $theme.color.textShy : $theme.color.textDark;
  $: contentId = `${key}-content`;
  $: buttonId = `${key}-button`;

  const inert = true;
  const size = 16;
  const color = iconColor;
  const tabIndex = -1;
</script>

<section class="accordion" class:shy class:is-expanded={isExpanded}>
  <header class="accordion-header" class:disabled>
    <div class="accordion-header-content">
      {#if $$slots.icon}
        <span class="accordion-header-icon" class:disabled>
          <slot name="icon" {inert} {size} {color} {tabIndex} />
        </span>
      {/if}
      <Text as="h3" type="text2Medium" color={textColor}>{title}</Text>
    </div>
    <div class="accordion-header-actions">
      <Button
        size="small"
        iconPosition="iconOnly"
        type="shy"
        {disabled}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        id={buttonId}
        aria-disabled={disabled && isExpanded}
        on:click={toggleAccordion}
      >
        <ExpandMoreOrLess tabindex="-1" inert slot="icon" />
      </Button>
    </div>
  </header>
  <div
    class="accordion-content"
    class:is-expanded={isExpanded}
    id={contentId}
    aria-labelledby={buttonId}
    role="region"
  >
    <slot />
  </div>
</section>

<style lang="scss">
  .accordion {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid var(--color-borderNeutral);

    &.shy {
      border-bottom: none;
    }

    &.is-expanded {
      gap: var(--spacingXS);

      .accordion-header {
        padding-bottom: var(--spacingXS);
      }

      .accordion-content {
        max-height: none;
        opacity: inherit;
        padding-bottom: var(--spacingLG);
      }

      .accordion-header-actions {
        rotate: 180deg;
      }
    }

    .accordion-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: var(--spacingXS);
      padding-left: var(--spacingXS);
      padding-right: var(--spacingXS);
      padding-bottom: var(--spacingLG);

      .accordion-header-actions {
        transition: rotate 0.15s;
      }

      &:has(.accordion-header-actions:hover) {
        background-color: var(--color-interactionOutlinedHover);
      }
      &.disabled:has(.accordion-header-actions:hover) {
        background-color: inherit;
      }

      &:has(.accordion-header-actions:active),
      &:has(.accordion-header-actions:focus-visible),
      &:has(.accordion-header-actions:focus-visible:hover) {
        background-color: var(--color-interactionOutlinedPress);
      }

      &.disabled:has(.accordion-header-actions:active),
      &.disabled:has(.accordion-header-actions:focus-visible),
      &.disabled:has(.accordion-header-actions:focus-visible:hover) {
        background-color: inherit;
      }

      .accordion-header-content {
        display: flex;
        align-items: center;
        gap: var(--spacingSM);

        .accordion-header-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: var(--spacing3XS);
          background-color: var(--color-surfaceWhite);
          border-radius: var(--radiusFull);

          &.disabled,
          &.disabled:hover,
          &.disabled:focus,
          &.disabled:focus:hover {
            background-color: var(--color-interactionDisable);
          }
        }
      }
    }

    .accordion-content {
      max-height: 0;
      overflow: hidden;
      transition: opacity 0.15s;
      opacity: 0;
    }
  }
</style>

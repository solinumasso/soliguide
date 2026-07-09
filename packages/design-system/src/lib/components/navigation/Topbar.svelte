<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import ChevronLeft from 'svelte-google-materialdesign-icons/Chevron_left.svelte';
  import type { TopbarType } from '$lib/types/TopBar';
  import type { ButtonType } from '$lib/types/Button';
  import type { TopbarAction } from '$lib/types/TopbarAction';
  import Button from '$lib/components/buttons/Button.svelte';
  import ActionButton from '$lib/components/ActionButton.svelte';
  import Text from '$lib/components/Text.svelte';

  export let title = '';

  export let type: TopbarType = 'gradient';
  export let navigateBackAriaLabel = 'Back';
  export let actions: TopbarAction[] = [];

  const buttonTypeMapping: Record<TopbarType, ButtonType> = {
    gradient: 'shy',
    reversedGradient: 'reversed',
    transparent: 'shy',
    reversedTransparent: 'reversed'
  };

  const dispatch = createEventDispatcher<{ navigate: null } & Record<string, null>>();
</script>

<!-- IN V2, to include the buttons, check what was done in src/routes/actions/+page.svelte with actions buttons -->
<nav class={type}>
  <Button
    type={buttonTypeMapping[type]}
    iconPosition="iconOnly"
    aria-label={navigateBackAriaLabel}
    title={navigateBackAriaLabel}
    on:click={() => dispatch('navigate')}
  >
    <ChevronLeft slot="icon" />
  </Button>

  <div class="nav-title">
    <Text type="title3PrimaryExtraBold">{title}</Text>
  </div>

  <div class="nav-actions">
    {#each actions as action}
      <ActionButton
        type={action.type || 'button'}
        label={action.label}
        icon={action.icon}
        iconColor={action.iconColor}
        active={action.active || false}
        reversed={type === 'reversedGradient' || type === 'reversedTransparent'}
        on:action={() => dispatch(action.eventKey)}
      />
    {/each}
    <slot name="actions" />
  </div>
</nav>

<style lang="scss">
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    padding: 0 var(--spacingLG);
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: var(--topbar-height);
    z-index: 1;

    &.gradient {
      background: var(--color-gradientBackground);
      color: var(--color-textDark);
    }
    &.reversedGradient {
      background: var(--color-gradientSecondary);
      color: var(--color-textInverse);
    }
    &.transparent {
      color: var(--color-textDark);
    }
    &.reversedTransparent {
      color: var(--color-textInverse);
    }
  }

  .nav-title {
    width: 100%;
    text-align: center;
  }

  .nav-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 48px;
    flex-shrink: 0;
    gap: var(--spacingXS);
  }
</style>

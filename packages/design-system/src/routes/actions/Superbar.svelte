<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import MoreHoriz from 'svelte-google-materialdesign-icons/More_horiz.svelte';
  import Text from '$lib/components/Text.svelte';
  import ActionButton from './ActionButton.svelte';
  import Dropdown from './Dropdown.svelte';
  import type { SuperbarAction, SuperbarActionEventKey } from '../types';

  export let title = 'Superbar';
  export let reversed = false;
  export let actions: SuperbarAction[] = [];

  const dispatch = createEventDispatcher<Record<SuperbarActionEventKey, null>>();
  const dropdownClick = (event: CustomEvent<string>) =>
    dispatch(event.detail as SuperbarActionEventKey);

  // Calculate actions repartition
  $: internalActions =
    actions.length > 2
      ? [
          actions[0],
          {
            label: 'More',
            icon: MoreHoriz,
            eventKey: 'more' as SuperbarActionEventKey,
            hasDropdown: true
          }
        ]
      : actions;

  $: extraActions = actions.length > 2 ? actions.slice(1) : [];
  $: clickMenu = dropdownClick;
</script>

<div class="container" class:reversed>
  <div><Text type="title3PrimaryExtraBold">{title}</Text></div>
  <div class="actions">
    {#each internalActions as action}
      {#if 'hasDropdown' in action && action.hasDropdown}
        <div class="dropdown-container">
          <ActionButton
            label={action.label}
            icon={action.icon}
            {reversed}
            on:action={() => dispatch(action.eventKey)}
          />
          <div class="dropdown">
            <Dropdown options={extraActions} on:clickMenu={clickMenu} />
          </div>
        </div>
      {:else}
        <ActionButton
          type={'type' in action ? action.type : 'button'}
          label={action.label}
          icon={action.icon}
          {reversed}
          on:action={() => dispatch(action.eventKey)}
        />
      {/if}
    {/each}
  </div>
</div>

<style lang="scss">
  .container {
    display: flex;
    height: 64px;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--spacingLG);
    gap: var(--spacingLG);
    color: var(--color-textDark);
    background-color: var(--color-textInverse);

    &.reversed {
      background: var(--color-gradientSecondary);
      color: var(--color-textInverse);
    }
  }

  .actions {
    display: flex;
    gap: var(--spacingXS);
  }

  .dropdown-container {
    position: relative;
    &:hover .dropdown {
      display: block;
    }

    .dropdown {
      display: none;
      position: absolute;
    }
  }
</style>

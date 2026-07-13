<script lang="ts">
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { contextKey } from '$lib/components/dataDisplay/Accordion/contextKey';
  import type { AccordionContext } from '$lib/types/Accordion';

  export let singleOneExpanded = false;

  const current = writable(new Map<string, boolean>());

  const defaultToggleExpand = (childKey: string) => {
    current.update((map) => {
      map.set(childKey, !map.get(childKey));
      return map;
    });
  };
  const toggleExpandSingleChild = (childKey: string) => {
    current.update((map) => {
      const result = new Map<string, boolean>();
      map.forEach((value, key) => {
        result.set(key, key === childKey ? !value : false);
      });
      return result;
    });
  };

  const defaultRegister = (childKey: string, isExpanded: boolean) => {
    current.update((map) => {
      map.set(childKey, isExpanded);
      return map;
    });
  };
  const registerSingleChild = (childKey: string, isExpanded: boolean) => {
    current.update((map) => {
      const result = new Map<string, boolean>();
      map.set(childKey, isExpanded);
      map.forEach((value, key) => {
        if (key === childKey) {
          result.set(key, value);
        } else {
          result.set(key, false);
        }
      });
      return result;
    });
  };

  setContext<AccordionContext>(contextKey, {
    toggleExpand: singleOneExpanded ? toggleExpandSingleChild : defaultToggleExpand,
    register: singleOneExpanded ? registerSingleChild : defaultRegister,
    state: current
  });
</script>

<section class="accordion-group">
  <slot />
</section>

<style lang="scss">
  .accordion-group {
    display: flex;
    flex-direction: column;
  }
</style>

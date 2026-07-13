<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let observer: IntersectionObserver;

  let elementToObserve: HTMLElement | null = null;

  /**
   * Sets up the Intersection Observer
   */
  const setupIntersectionObserver = () => {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          dispatch('intersect');
        }
      },
      { rootMargin: '200px' }
    );

    if (elementToObserve) {
      observer.observe(elementToObserve);
    }
  };

  onMount(() => {
    setupIntersectionObserver();
  });

  /**
   * Updates the element to observe reference
   */
  const updateElementToObserve = (node: HTMLElement) => {
    if (observer) {
      observer.disconnect();
      observer.observe(node);
    }
  };
</script>

<div bind:this={elementToObserve} use:updateElementToObserve></div>

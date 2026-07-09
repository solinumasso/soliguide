<script lang="ts">
  import MyLocation from 'svelte-google-materialdesign-icons/My_location.svelte';
  import { ListItem, AppIcon, PageLoader } from '@soliguide/design-system';

  export let headline = '';
  export let loading = false;
</script>

<PageLoader {loading}>
  <ListItem title={headline} shape="rounded" type="actionFull" size="small" on:click>
    <AppIcon slot="icon" icon={MyLocation} type="primary" />
  </ListItem>
</PageLoader>

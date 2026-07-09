<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { BasicCard, Text, Button, type types } from '@soliguide/design-system';

  export let cardType: types.BasicCardType = 'default';
  export let title = '';
  export let description = '';
  export let actionName;
  export let imgUrl;

  const dispatch = createEventDispatcher();
</script>

<BasicCard type={cardType}>
  <div class="card-content">
    <div class="main-content">
      <div class="text-content">
        <Text type="title4PrimaryBold">{title}</Text>
        <Text type="caption1" color="shy">{description}</Text>
      </div>
      <div class="img-container">
        <img src={imgUrl} alt="icon" aria-hidden="true" />
      </div>
    </div>
    <div class="footer">
      <Button type="neutralOutlined" size="xsmall" on:click={() => dispatch('action')}>
        {actionName}
      </Button>
    </div>
  </div>
</BasicCard>

<style lang="scss">
  .card-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacingLG);
  }

  .main-content {
    display: flex;
    align-items: center;
    gap: var(--spacing2XS);
  }

  .text-content {
    display: flex;
    flex-direction: column;
    flex-grow: 2;
  }

  .img-container {
    min-width: 53px;
    text-align: center;
  }

  .footer {
    text-align: center;
  }
</style>

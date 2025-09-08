<script lang="ts">
  import { getContext } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Text,
    ButtonLink
  } from '@soliguide/design-system';
  import type { I18nStore, RoutingStore } from '$lib/client/types';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { getMapLink, ROUTES_CTX_KEY } from '$lib/client/index';
  import { TodayInfo, PlaceStatus } from '$lib/components';
  import NearMe from 'svelte-google-materialdesign-icons/Near_me.svelte';
  import type { LightPlace } from '$lib/models/types';

  const routes: RoutingStore = getContext(ROUTES_CTX_KEY);
  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  export let place: LightPlace;
  const href = `${$routes.ROUTE_PLACES}/${place.url}`;
</script>

<Card>
  <div class="card-container">
    <a class="card-link" {href}>
      <CardHeader>
        <div class="card-header-container">
          <div class="card-title">
            <Text ellipsis type="title3PrimaryExtraBold">{place.name}</Text>
          </div>

          <div class="card-header-infos-container">
            <PlaceStatus status={place.status} />
            <div>
              <TodayInfo todayInfo={place.todayInfo} />
            </div>
          </div>
        </div>
      </CardHeader>
    </a>
    <CardBody>
      <div class="card-body">
        <div class="card-body-adress">
          <span class="card-body-adress-text">
            <Text type="text2Medium">{place.address}</Text>
          </span>
          <ButtonLink
            size="small"
            iconPosition="iconOnly"
            type="primaryOutline"
            href={getMapLink(place.address)}><NearMe slot="icon" /></ButtonLink
          >
        </div>
      </div>
    </CardBody>
    <CardFooter>
      <div class="card-footer">
        <Button role="link" on:click={() => goto(href)} size="small" type="primaryGradientFill"
          >{$i18n.t('PLUS_INFOS')}
        </Button>
      </div>
    </CardFooter>
  </div>
</Card>

<style lang="scss">
  $cardHeaderHeight: 80px;

  .card-container {
    width: 240px;
  }

  .card-title {
    display: flex;
    align-items: center;
    gap: var(--spacingXS);
  }

  .card-link {
    text-decoration: none;
  }

  .card-header-container {
    position: relative;
    height: $cardHeaderHeight;
  }

  .card-header-infos-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing3XS);
  }

  .card-body {
    padding: 0 var(--spacingLG);
    display: flex;
    flex-direction: column;
    gap: var(--spacingLG);
    width: 100%;
  }

  .card-body-adress {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacingXS);
  }

  .card-body-adress-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-footer {
    gap: var(--spacingXL);
    display: flex;
    justify-content: center;
    width: 100%;
  }
</style>

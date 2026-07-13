<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte';
  import { Modal, Text, Link, ToggleSwitch, Button } from '@soliguide/design-system';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { setZDCookieConsent } from '$lib/client';
  import { COOKIE_CTX_KEY } from '$lib/client/cookie';
  import type { CookieConsentStore, I18nStore } from '$lib/client/types';

  export let cookiePolicyLink: string;
  export let zendeskChatbotLink: string;

  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const cookieStore: CookieConsentStore = getContext(COOKIE_CTX_KEY);

  const dispatch = createEventDispatcher();
  let cookiesEnabled = $cookieStore;

  const validateForm = () => {
    setZDCookieConsent(cookiesEnabled);
    cookieStore.set(cookiesEnabled);
    dispatch('close');
  };
</script>

<Modal title={$i18n.t('COOKIES_TITLE')} on:close>
  <div class="modal-content">
    <Text type="caption1">{$i18n.t('WHY_WE_USE_COOKIES')}</Text>
    <Text type="caption1">
      <Link href={cookiePolicyLink} underline size="xsmall">{$i18n.t('OUR_COOKIE_POLICY')}</Link>
      &nbsp;{$i18n.t('CAN_BE_REVIEWED_FOR_MORE_INFORMATION')}
    </Text>
    <div class="cookie-form">
      <Text type="caption1">
        {$i18n.t('I_ACCEPT_COOKIES')}&nbsp;<Link href={zendeskChatbotLink} underline size="xsmall">
          {$i18n.t('ZENDESK_CHATBOT')}
        </Link>
      </Text>
      <div>
        <ToggleSwitch bind:checked={cookiesEnabled} />
      </div>
    </div>
  </div>
  <svelte:fragment slot="footer">
    <Button type="shy" on:click={() => dispatch('close')}>{$i18n.t('CANCEL')}</Button>
    <Button on:click={validateForm}>{$i18n.t('VALIDATE')}</Button>
  </svelte:fragment>
</Modal>

<style lang="scss">
  .modal-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacingLG);
  }
  .cookie-form {
    display: flex;
    align-items: flex-start;
    gap: var(--spacingXS);
  }
</style>

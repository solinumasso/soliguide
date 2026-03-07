import { writable } from 'svelte/store';
import type { ZendeskState } from './types';

const initialState: ZendeskState = {
  hasNewMessage: false
};

const getZendeskService = () => {
  // skipcq JS-0337
  // eslint-disable-next-line fp/no-let,@typescript-eslint/no-empty-function
  let closeCB = () => {};

  const zendeskStore = writable(initialState);

  const init = () => {
    if (!window.zE) {
      console.log('ZD is not available');
    }

    window.zE('messenger:set', 'cookies', true);
    window.zE('messenger', 'hide');
    window.zE('messenger:on', 'close', () => {
      closeCB();
    });

    window.zE('messenger:on', 'unreadMessages', (count: number) => {
      console.log(`It seems you have ${count} unread messages!`);
      zendeskStore.update((value) => ({ ...value, hasNewMessage: count > 0 }));
    });
  };

  const openChat = () => {
    window.zE('messenger', 'open');
    window.zE('messenger', 'show');
  };

  const closeChat = () => {
    window.zE('messenger', 'hide');
    window.zE('messenger', 'close');
  };

  const disconnectZendesk = () => {
    window.zE('messenger:set', 'cookies', false);
    window.zE('messenger', 'close');
    window.zE('messenger', 'logoutUser');
  };

  /**
   * Set a callback to be called when the close event is triggered by zendesk widget
   */
  const registerCloseCallback = (callback = closeCB) => {
    if (typeof callback === 'function') {
      // eslint-disable-next-line fp/no-mutation
      closeCB = callback;
    }
  };

  /**
   * Toggle the value of the hasNewMessage store
   */
  const removeMessageNotification = () => {
    zendeskStore.update((value) => ({ ...value, hasNewMessage: true }));
  };

  return {
    openChat,
    closeChat,
    subscribe: zendeskStore.subscribe,
    init,
    disconnectZendesk,
    registerCloseCallback,
    removeMessageNotification
  };
};

// Expose a singleton
const zendeskService = getZendeskService();

export { zendeskService };

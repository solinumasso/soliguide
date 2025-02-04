<!--
Soliguide: Useful information for those who need it

SPDX-FileCopyrightText: © 2025 Solinum

SPDX-License-Identifier: AGPL-3.0-only

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->
<script lang="js">
  import { env } from '$env/dynamic/public';
  import { browser } from '$app/environment';

  const load = () => {
    // Check if we're running in the browser
    if (env.PUBLIC_GTM_ID && browser) {
      // Silktide
      // Initialize the dataLayer
      window.dataLayer = window.dataLayer ?? [];

      // Create the gtag function that pushes to the dataLayer
      function gtag() {
        dataLayer.push(arguments);
      }

      // Set consent defaults
      gtag('consent', 'default', {
        analytics_storage:
          localStorage.getItem('silktideCookieChoice_analytics') === 'true' ? 'granted' : 'denied',
        ad_storage:
          localStorage.getItem('silktideCookieChoice_marketing') === 'true' ? 'granted' : 'denied',
        ad_user_data:
          localStorage.getItem('silktideCookieChoice_marketing') === 'true' ? 'granted' : 'denied',
        ad_personalization:
          localStorage.getItem('silktideCookieChoice_marketing') === 'true' ? 'granted' : 'denied',
        functionality_storage:
          localStorage.getItem('silktideCookieChoice_necessary') === 'true' ? 'granted' : 'denied',
        security_storage:
          localStorage.getItem('silktideCookieChoice_necessary') === 'true' ? 'granted' : 'denied'
      });

      window.silktideCookieBannerManager.updateCookieBannerConfig({
        background: {
          showBackground: false
        },
        cookieIcon: {
          position: 'bottomRight'
        },
        cookieTypes: [
          {
            id: 'necessary',
            name: 'Necessary',
            description:
              '<p>These cookies are necessary for the website to function properly and cannot be switched off. They help with things like logging in and setting your privacy preferences.</p>',
            required: true,
            onAccept: function () {
              console.log('Add logic for the required Necessary here');
            }
          },
          {
            id: 'analytics',
            name: 'Analytical',
            description:
              '<p>These cookies help us improve the site by tracking which pages are most popular and how visitors move around the site.</p>',
            defaultValue: true,
            onAccept: function () {
              gtag('consent', 'update', {
                analytics_storage: 'granted'
              });
              dataLayer.push({
                event: 'consent_accepted_analytics'
              });
            },
            onReject: function () {
              gtag('consent', 'update', {
                analytics_storage: 'denied'
              });
            }
          },
          {
            id: 'advertising',
            name: 'Advertising',
            description:
              '<p>These cookies provide extra features and personalization to improve your experience. They may be set by us or by partners whose services we use.</p>',
            onAccept: function () {
              gtag('consent', 'update', {
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted'
              });
              dataLayer.push({
                event: 'consent_accepted_advertising'
              });
            },
            onReject: function () {
              gtag('consent', 'update', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
              });
            }
          }
        ],
        text: {
          banner: {
            description:
              '<p>We use cookies on our site to enhance your user experience, provide personalized content, and analyze our traffic. <a href="https://your-website.com/cookie-policy" target="_blank">Cookie Policy.</a></p>',
            acceptAllButtonText: 'Accept all',
            acceptAllButtonAccessibleLabel: 'Accept all cookies',
            rejectNonEssentialButtonText: 'Reject non-essential',
            rejectNonEssentialButtonAccessibleLabel: 'Reject non-essential',
            preferencesButtonText: 'Preferences',
            preferencesButtonAccessibleLabel: 'Toggle preferences'
          },
          preferences: {
            title: 'Customize your cookie preferences',
            description:
              '<p>We respect your right to privacy. You can choose not to allow some types of cookies. Your cookie preferences will apply across our website.</p>',
            creditLinkText: 'Get this banner for free',
            creditLinkAccessibleLabel: 'Get this banner for free'
          }
        }
      });
      // End Silktide

      /* eslint-disable */
      // Follow the GTM snippet
      (function (w, d, s, l, i) {
        // @ts-ignore
        w[l] = w[l] || [];
        // @ts-ignore
        w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
        var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s),
          dl = l != 'dataLayer' ? '&l=' + l : '';
        // @ts-ignore
        j.async = true;
        // @ts-ignore
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
        // @ts-ignore
        f.parentNode.insertBefore(j, f);
      })(window, document, 'script', 'dataLayer', env.PUBLIC_GTM_ID);
      /* eslint-enable */
    }
  };
</script>

<svelte:head>
  <script
    id="silktide-consent-manager"
    src="/js/silktide-consent-manager.js"
    on:load={load}
  ></script>
</svelte:head>

{#if env.PUBLIC_GTM_ID}
  <noscript>
    <!-- svelte-ignore a11y-missing-attribute -->
    <iframe
      src={'https://www.googletagmanager.com/ns.html?id=' + env.PUBLIC_GTM_ID}
      height="0"
      width="0"
      style="display:none;visibility:hidden"
    ></iframe>
  </noscript>
{/if}

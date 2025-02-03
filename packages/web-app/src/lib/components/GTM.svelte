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
<script lang="ts">
  import { onMount } from 'svelte';
  import { env } from '$env/dynamic/public';
  import { browser } from '$app/environment';

  onMount(() => {
    // Check if we're running in the browser
    if (env.PUBLIC_GTM_ID && browser) {
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
  });
</script>

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

<!--
Soliguide: Useful information for those who need it

SPDX-FileCopyrightText: © 2024 Solinum

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

<style>
  /* .accordion-group {
    display: flex;
    flex-direction: column;
  } */
</style>

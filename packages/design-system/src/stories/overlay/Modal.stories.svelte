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
<script lang="ts" context="module">
  import type { ComponentProps } from 'svelte';

  import type { ModalSize } from '$lib/types';
  import Modal from '$lib/components/feedback/Modal.svelte';

  export const meta = {
    title: 'Overlay/Modal',
    component: Modal,
    argTypes: {
      size: {
        control: { type: 'radio' },
        options: ['small', 'medium', 'large'] satisfies ModalSize[]
      },
      modalInstance: { table: { disable: true } }
    },
    args: {
      title: 'Modal title',
      size: 'small',
      backdropClick: true
    } satisfies ComponentProps<Modal>
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import Button from '$lib/components/buttons/Button.svelte';
  import Text from '$lib/components/Text.svelte';

  let showModal = false;

  const closeModal = () => {
    showModal = false;
  };
</script>

<Template let:args>
  <Button on:click={() => (showModal = true)}>Open</Button>
  {#if showModal}
    <Modal {...args} on:close={closeModal}>
      <Text type="text2">
        Nec dolor vulputate, venenatis risus quis, scelerisque eros. Interdum et salade malesuada
        fames ac ante ipsum primis in truelle faucibus. Curabitur ut sodales erat. Pellentesque
        habitant vache morbi tristique senectus et netus et malesuada<br /> <br />Fames ac turpis
        egestas. Praesent pulvinar eros sit amet sem accumsan, at escargot posuere tortor hendrerit.
        Etiam quis purus convallis, vehicula arrosoir purus quis, eleifend purus. Duis ultricies
        metus at nulla lacinia pellentesque.
      </Text>
      <svelte:fragment slot="footer">
        <Button type="shy" on:click={closeModal}>Cancel</Button>
        <Button on:click={closeModal}>Custom action (close)</Button>
      </svelte:fragment>
    </Modal>
  {/if}
</Template>

<Story name="Default" />

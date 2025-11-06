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
  import { Card, CardHeader, CardBody, CardFooter } from '$lib/components/dataDisplay/Card';

  export const meta = {
    title: 'Structure/Card',
    component: Card,
    argTypes: {},
    args: {}
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import Text from '$lib/components/Text.svelte';
  import Button from '$lib/components/buttons/Button.svelte';
</script>

<Template let:args>
  <div class="cardContainer">
    <Card {...args}>
      <CardHeader on:click={() => console.log('the header')}>
        <Text type="title1PrimaryExtraBold">This is the card title</Text>
        <Text type="text2Medium">This is the card subtitle</Text>
      </CardHeader>
      <CardBody>
        <div class="cardBodyContainer">
          <Text type="text2Medium">This is the card body</Text>
          <Text type="text2Medium">This is the card body</Text>
          <Text type="text2Medium">This is the card body</Text>
          <Text type="text2Medium">This is the card body</Text>
          <Text type="text2Medium">This is the card body</Text>
          <Text type="text2Medium">This is the card body</Text>
          <Text type="text2Medium">This is the card body</Text>
          <Text type="text2Medium">This is the card body</Text>
        </div>
      </CardBody>
      <CardFooter>
        <div class="cardFooterContainer">
          <Button type="neutralOutlined">Secondary action</Button>
          <Button>Primary action</Button>
        </div>
      </CardFooter>
    </Card>
  </div>
</Template>

<Story name="Example" />

<Story name="Card with card header disabled" args={{}} let:args>
  <div class="cardContainer">
    <Card {...args}>
      <CardHeader disabled>
        <Text type="title1PrimaryExtraBold">This is the card title</Text>
        <Text type="text2Medium">This is the card subtitle</Text>
      </CardHeader>
      <CardBody>
        <div class="cardBodyContainer">
          <Text type="text2Medium">This is the card body</Text>
        </div>
      </CardBody>
      <CardFooter>
        <div class="cardFooterContainer">
          <Button type="neutralOutlined">Secondary action</Button>
          <Button>Primary action</Button>
        </div>
      </CardFooter>
    </Card>
  </div>
</Story>

<style>
  .cardContainer {
    width: 600px;
  }
  .cardBodyContainer {
    padding: 0 var(--spacingLG);
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }
  .cardFooterContainer {
    gap: var(--spacingXL);
    display: flex;
    justify-content: center;
    width: 100%;
  }
</style>

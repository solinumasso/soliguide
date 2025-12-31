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
  import type { CategoriesSpecificFields } from '@soliguide/common';
  import {
    DinnerDining,
    SetMeal,
    RestaurantMenu,
    ShoppingCart,
    ThermostatAuto,
    Cake,
    Flag,
    EmojiNature,
    Countertops,
    Straighten,
    ConfirmationNumber,
    BusinessCenter,
    RecordVoiceOver,
    FaceRetouchingNatural,
    CleanHands,
    Badge,
    SportsFootball,
    type types as DSTypes
  } from '@soliguide/design-system';
  import type { ComponentType, SvelteComponent } from 'svelte';

  export let categorySpecificFields: keyof CategoriesSpecificFields;

  export let variation: DSTypes.VariationType = 'outlined';

  /**
   * Mapping of category specific fields to their corresponding icons
   */
  const iconMapping: Record<keyof CategoriesSpecificFields, ComponentType<SvelteComponent>> = {
    activityName: SportsFootball,
    availableEquipmentPrecisions: Countertops,
    availableEquipmentType: Countertops,
    babyParcelAgeType: Cake,
    canteensMealType: RestaurantMenu,
    courseType: RecordVoiceOver,
    degreeOfChoiceType: ThermostatAuto,
    dietaryAdaptationsType: SetMeal,
    dietaryRegimesType: SetMeal,
    domiciliationType: Badge,
    foodProductType: ShoppingCart,
    otherProductTypePrecisions: ShoppingCart,
    hygieneProductType: CleanHands,
    jobsList: BusinessCenter,
    nationalOriginProductType: Flag,
    organicOriginProductType: EmojiNature,
    serviceStyleType: DinnerDining,
    usageModality: Straighten,
    voucherType: ConfirmationNumber,
    voucherTypePrecisions: ConfirmationNumber,
    wellnessActivityName: FaceRetouchingNatural
  };

  $: icon = iconMapping[categorySpecificFields];
</script>

<svelte:component this={icon} {variation} size={'16'} />

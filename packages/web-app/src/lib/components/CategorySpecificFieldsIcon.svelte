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

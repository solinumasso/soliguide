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
  import {
    BabyParcel,
    MedicalServices,
    SmokeFree,
    MonitorHeart,
    Psychology,
    BabyChangingStation,
    MedicalInformation,
    TagFaces,
    PregnantWoman,
    Vaccines,
    Healing,
    DirectionsCar,
    NoCrash,
    Hail,
    DirectionsWalk,
    Work,
    Devices,
    School,
    BusinessCenter,
    CastForEducation,
    Bathtub,
    Shower,
    LocalLaundryService,
    Spa,
    Sanitizer,
    Masks,
    Forum,
    Balance,
    Email,
    Diversity,
    Create,
    AccessibleForward,
    Article,
    EscalatorWarning,
    Savings,
    Computer,
    ScreenShare,
    Wifi,
    Power,
    LocalPhone,
    CloudDone,
    Restaurant,
    LocalShipping,
    ShoppingBasket,
    Storefront,
    LocalDrink,
    Kitchen,
    Dining,
    ConfirmationNumber,
    LocalFlorist,
    Coffee,
    Chair,
    ChildCare,
    FamilyRestroom,
    Info,
    ColorLens,
    SportsSoccer,
    Museum,
    AutoStories,
    CheckRoom,
    Pets,
    Luggage,
    ShoppingBag,
    Home,
    Bedtime,
    LocalHotel,
    HomeWork,
    Cottage,
    RealEstateAgent,
    CarPooling,
    JobCoaching,
    Toilets,
    SharedKitchen,
    HairDresser,
    LegalProtection,
    type types as DSTypes
  } from '@soliguide/design-system';
  import { Categories } from '@soliguide/common';
  import type { ComponentType, SvelteComponent } from 'svelte';

  export let categoryId: Categories;

  export let variation: DSTypes.VariationType = 'outlined';

  /**
   * Mapping of categories to their corresponding icons
   */
  const iconMapping: Record<Categories, ComponentType<SvelteComponent>> = {
    // Health Categories
    [Categories.HEALTH]: MedicalServices,
    [Categories.ADDICTION]: SmokeFree,
    [Categories.STD_TESTING]: MonitorHeart,
    [Categories.PSYCHOLOGICAL_SUPPORT]: Psychology,
    [Categories.CHILD_CARE]: BabyChangingStation,
    [Categories.GENERAL_PRACTITIONER]: MedicalInformation,
    [Categories.DENTAL_CARE]: TagFaces,
    [Categories.PREGNANCY_CARE]: PregnantWoman,
    [Categories.VACCINATION]: Vaccines,
    [Categories.INFIRMARY]: Healing,
    [Categories.VET_CARE]: Pets,
    [Categories.HEALTH_SPECIALISTS]: MedicalServices,
    [Categories.ALLERGOLOGY]: MedicalServices,
    [Categories.CARDIOLOGY]: MedicalServices,
    [Categories.DERMATOLOGY]: MedicalServices,
    [Categories.ECHOGRAPHY]: MedicalServices,
    [Categories.ENDOCRINOLOGY]: MedicalServices,
    [Categories.GASTROENTEROLOGY]: MedicalServices,
    [Categories.GYNECOLOGY]: MedicalServices,
    [Categories.KINESITHERAPY]: MedicalServices,
    [Categories.MAMMOGRAPHY]: MedicalServices,
    [Categories.OPHTHALMOLOGY]: MedicalServices,
    [Categories.OTORHINOLARYNGOLOGY]: MedicalServices,
    [Categories.NUTRITION]: MedicalServices,
    [Categories.PEDICURE]: MedicalServices,
    [Categories.PHLEBOLOGY]: MedicalServices,
    [Categories.PNEUMOLOGY]: MedicalServices,
    [Categories.RADIOLOGY]: MedicalServices,
    [Categories.RHEUMATOLOGY]: MedicalServices,
    [Categories.UROLOGY]: MedicalServices,
    [Categories.SPEECH_THERAPY]: MedicalServices,
    [Categories.STOMATOLOGY]: MedicalServices,
    [Categories.OSTEOPATHY]: MedicalServices,
    [Categories.ACUPUNCTURE]: MedicalServices,

    // Mobility Categories
    [Categories.CARPOOLING]: CarPooling,
    [Categories.MOBILITY]: DirectionsCar,
    [Categories.PROVISION_OF_VEHICLES]: NoCrash,
    [Categories.CHAUFFEUR_DRIVEN_TRANSPORT]: Hail,
    [Categories.MOBILITY_ASSISTANCE]: DirectionsWalk,

    // Training and Jobs Categories
    [Categories.TRAINING_AND_JOBS]: Work,
    [Categories.DIGITAL_TOOLS_TRAINING]: Devices,
    [Categories.JOB_COACHING]: JobCoaching,
    [Categories.FRENCH_COURSE]: School,
    [Categories.CATALAN_COURSE]: School,
    [Categories.SPANISH_COURSE]: School,
    [Categories.INTEGRATION_THROUGH_ECONOMIC_ACTIVITY]: BusinessCenter,
    [Categories.TUTORING]: CastForEducation,

    // Hygiene Categories
    [Categories.HYGIENE_AND_WELLNESS]: Bathtub,
    [Categories.SHOWER]: Shower,
    [Categories.LAUNDRY]: LocalLaundryService,
    [Categories.WELLNESS]: Spa,
    [Categories.TOILETS]: Toilets,
    [Categories.HYGIENE_PRODUCTS]: Sanitizer,
    [Categories.HAIRDRESSER]: HairDresser,
    [Categories.FACE_MASKS]: Masks,

    // Counseling Categories
    [Categories.COUNSELING]: Forum,
    [Categories.LEGAL_ADVICE]: Balance,
    [Categories.DOMICILIATION]: Email,
    [Categories.SOCIAL_ACCOMPANIMENT]: Diversity,
    [Categories.PUBLIC_WRITER]: Create,
    [Categories.DISABILITY_ADVICE]: AccessibleForward,
    [Categories.ADMINISTRATIVE_ASSISTANCE]: Article,
    [Categories.PARENT_ASSISTANCE]: EscalatorWarning,
    [Categories.BUDGET_ADVICE]: Savings,
    [Categories.LEGAL_PROTECTION]: LegalProtection,

    // Technology Categories
    [Categories.TECHNOLOGY]: Computer,
    [Categories.COMPUTERS_AT_YOUR_DISPOSAL]: ScreenShare,
    [Categories.WIFI]: Wifi,
    [Categories.ELECTRICAL_OUTLETS_AVAILABLE]: Power,
    [Categories.TELEPHONE_AT_YOUR_DISPOSAL]: LocalPhone,
    [Categories.DIGITAL_SAFE]: CloudDone,

    // Food Categories
    [Categories.FOOD]: Restaurant,
    [Categories.FOOD_DISTRIBUTION]: LocalShipping,
    [Categories.FOOD_PACKAGES]: ShoppingBasket,
    [Categories.BABY_PARCEL]: BabyParcel,
    [Categories.SOCIAL_GROCERY_STORES]: Storefront,
    [Categories.FOUNTAIN]: LocalDrink,
    [Categories.SOLIDARITY_FRIDGE]: Kitchen,
    [Categories.SHARED_KITCHEN]: SharedKitchen,
    [Categories.COOKING_WORKSHOP]: Dining,
    [Categories.FOOD_VOUCHER]: ConfirmationNumber,
    [Categories.COMMUNITY_GARDEN]: LocalFlorist,

    // Welcome Categories
    [Categories.WELCOME]: Coffee,
    [Categories.DAY_HOSTING]: Coffee,
    [Categories.REST_AREA]: Chair,
    [Categories.BABYSITTING]: ChildCare,
    [Categories.FAMILY_AREA]: FamilyRestroom,
    [Categories.INFORMATION_POINT]: Info,

    // Activities Categories
    [Categories.ACTIVITIES]: ColorLens,
    [Categories.SPORT_ACTIVITIES]: SportsSoccer,
    [Categories.MUSEUMS]: Museum,
    [Categories.LIBRARIES]: AutoStories,
    [Categories.OTHER_ACTIVITIES]: ColorLens,

    // Equipment Categories
    [Categories.EQUIPMENT]: CheckRoom,
    [Categories.LUGGAGE_STORAGE]: Luggage,
    [Categories.SOLIDARITY_STORE]: ShoppingBag,
    [Categories.CLOTHING]: CheckRoom,
    [Categories.ANIMAL_ASSITANCE]: Pets,

    // Accommodation and Housing Categories
    [Categories.ACCOMODATION_AND_HOUSING]: Home,
    [Categories.OVERNIGHT_STOP]: Bedtime,
    [Categories.EMERGENCY_ACCOMMODATION]: LocalHotel,
    [Categories.LONG_TERM_ACCOMODATION]: HomeWork,
    [Categories.CITIZEN_HOUSING]: Cottage,
    [Categories.ACCESS_TO_HOUSING]: RealEstateAgent
  };

  $: icon = iconMapping[categoryId];
</script>

<svelte:component this={icon} size={'16'} {variation} />

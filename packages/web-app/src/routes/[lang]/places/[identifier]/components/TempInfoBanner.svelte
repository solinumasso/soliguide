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
  import { TempInfoStatus, TempInfoType } from '@soliguide/common';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { getContext } from 'svelte';
  import { InfoBlock, type types as DSTypes } from '@soliguide/design-system';
  import { page } from '$app/stores';
  import { formatDateToLocale } from '$lib/client';
  import type { I18nStore } from '$lib/client/types';
  import { DisplayMode, type PlaceTempInfoHoursReady } from '$lib/models/types';
  import type { PageController } from '../types';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const pageController: PageController = getContext('PLACE_CONTROLLER_CTX_KEY');

  export let tempInfo: PlaceTempInfoHoursReady;
  export let tempInfoType: TempInfoType;
  export let closureDisplayMode: DisplayMode;
  export let hoursDisplayMode: DisplayMode;

  const getTitle = (type: TempInfoType, info: PlaceTempInfoHoursReady) => {
    switch (type) {
      case TempInfoType.HOURS:
        if (info.status === TempInfoStatus.CURRENT) {
          return $i18n.t('EXCEPTIONAL_OPENING_HOURS');
        }
        return $i18n.t('EXCEPTIONAL_OPENING_HOURS_TO_COME');
      case TempInfoType.CLOSURE:
        if (info.status === TempInfoStatus.CURRENT) {
          return $i18n.t('EXPORTS_HEADER_TEMP_CLOSURE');
        }
        return $i18n.t('TEMPORARY_CLOSURE_TO_COME');
      case TempInfoType.MESSAGE:
        return info.name;
      default:
        return '';
    }
  };

  const getDescription = (description: string | null) => {
    if (!description || tempInfoType === TempInfoType.HOURS) {
      return '';
    }

    return description;
  };

  const getFormatedDates = (info: PlaceTempInfoHoursReady, lang: string) => {
    const { dateDebut, dateFin } = info;

    if (!dateDebut) {
      return '';
    }

    if (dateDebut && dateFin) {
      return $i18n.t('APPLICABLE_TEMP_INFO_DATES', {
        startDate: formatDateToLocale(dateDebut, lang),
        endDate: formatDateToLocale(dateFin, lang)
      });
    }

    return $i18n.t('APPLICABLE_TEMP_INFO_START_DATE_ONLY', {
      startDate: formatDateToLocale(dateDebut, lang)
    });
  };

  const getButtonLabel = (
    type: TempInfoType,
    closureMode: DisplayMode,
    hoursMode: DisplayMode,
    infoStatus: TempInfoStatus
  ) => {
    const currentMode = type === TempInfoType.CLOSURE ? closureMode : hoursMode;

    if (currentMode === DisplayMode.TEMPORARY) {
      return infoStatus === TempInfoStatus.CURRENT
        ? $i18n.t('SHOW_REGULAR_HOURS')
        : $i18n.t('SHOW_CURRENT_HOURS');
    }

    return infoStatus === TempInfoStatus.INCOMING
      ? $i18n.t('SHOW_INCOMING_HOURS')
      : $i18n.t('SHOW_CURRENT_HOURS');
  };

  $: title = getTitle(tempInfoType, tempInfo);
  $: formatedDates = getFormatedDates(tempInfo, $page.data.lang);
  $: variant =
    tempInfo.status === TempInfoStatus.CURRENT && tempInfoType === TempInfoType.CLOSURE
      ? ('error' as DSTypes.InfoBlockVariant)
      : ('warning' as DSTypes.InfoBlockVariant);
  $: buttonLabel = getButtonLabel(
    tempInfoType,
    closureDisplayMode,
    hoursDisplayMode,
    tempInfo.status!
  );
  $: withButton = !(
    tempInfo.status === TempInfoStatus.INCOMING && tempInfoType === TempInfoType.CLOSURE
  );
</script>

{#if tempInfo.status === TempInfoStatus.CURRENT || tempInfo.status === TempInfoStatus.INCOMING}
  <InfoBlock
    withIcon={true}
    {variant}
    text={getDescription(tempInfo.description)}
    {title}
    date={formatedDates}
    buttonAction={() => pageController.toggleHours(tempInfoType)}
    {buttonLabel}
    {withButton}
  ></InfoBlock>
{/if}

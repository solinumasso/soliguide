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
  import { TempInfoStatus, type BasePlaceTempInfo } from '@soliguide/common';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { getContext } from 'svelte';
  import { InfoBlock } from '@soliguide/design-system';
  import { formatDateToLocale } from '$lib/client';
  import { page } from '$app/stores';
  import type { InfoBlockVariant } from '../../../../../../../design-system/dist/types';
  import type { I18nStore } from '$lib/client/types';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  export let tempInfo: BasePlaceTempInfo;
  export let tempInfoType: 'hours' | 'closure' | 'message';

  const getTitle = () => {
    switch (tempInfoType) {
      case 'hours':
        if (tempInfo.infoColor === 'danger') {
          tempInfo = { ...tempInfo, infoColor: 'warning' };
          return $i18n.t('EXCEPTIONAL_OPENING_HOURS');
        }
        return $i18n.t('EXCEPTIONAL_OPENING_HOURS_TO_COME');
      case 'closure':
        if (tempInfo.infoColor === 'danger') {
          return $i18n.t('EXPORTS_HEADER_TEMP_CLOSURE');
        }
        return $i18n.t('TEMPORARY_CLOSURE_TO_COME');
      case 'message':
        tempInfo = { ...tempInfo, infoColor: 'warning' };
        return tempInfo.name;
      default:
        return '';
    }
  };

  const getDescription = (description: string | null) => {
    if (!description || tempInfoType === 'hours') {
      return '';
    }

    return description;
  };

  const getFormatedDates = (info: BasePlaceTempInfo, lang: string) => {
    const { dateDebut, dateFin } = info;

    if (!dateDebut) {
      return;
    }

    if (dateDebut && dateFin) {
      // eslint-disable-next-line consistent-return
      return $i18n.t('APPLICABLE_TEMP_INFO_DATES', {
        startDate: formatDateToLocale(dateDebut, lang),
        endDate: formatDateToLocale(dateFin, lang)
      });
    }
    // eslint-disable-next-line consistent-return
    return $i18n.t('APPLICABLE_TEMP_INFO_START_DATE_ONLY', {
      startDate: formatDateToLocale(dateDebut, lang)
    });
  };

  $: title = getTitle();

  $: formatedDates = getFormatedDates(tempInfo, $page.data.lang);
  $: variant =
    tempInfo.status === TempInfoStatus.CURRENT && tempInfoType === 'closure'
      ? ('error' as InfoBlockVariant)
      : ('warning' as InfoBlockVariant);
</script>

{#if tempInfo.status === TempInfoStatus.CURRENT || tempInfo.status === TempInfoStatus.INCOMING}
  <InfoBlock
    withIcon={true}
    {variant}
    text={getDescription(tempInfo.description)}
    {title}
    date={formatedDates}
  ></InfoBlock>
{/if}

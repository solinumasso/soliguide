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
  import { getContext } from 'svelte';
  import { Tag, type types as DSTypes } from '@soliguide/design-system';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { PlaceOpeningStatus, PlaceStatus } from '@soliguide/common';
  import type { I18nStore } from '$lib/client/types';

  type DisplayStatus = PlaceOpeningStatus | PlaceStatus;

  export let openingStatus: PlaceOpeningStatus;
  export let placeStatus: PlaceStatus | null = null;

  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  const getTagVariant = (state: DisplayStatus): DSTypes.TagVariant => {
    switch (state) {
      case PlaceOpeningStatus.OPEN:
        return 'success';
      case PlaceOpeningStatus.PARTIALLY_OPEN:
        return 'warning';
      case PlaceOpeningStatus.CLOSED:
      case PlaceOpeningStatus.TEMPORARILY_CLOSED:
      case PlaceStatus.OFFLINE:
      case PlaceStatus.PERMANENTLY_CLOSED:
        return 'error';
      case PlaceStatus.DRAFT:
      default:
        return 'neutral';
    }
  };

  const getTagLabel = (state: DisplayStatus): string => {
    switch (state) {
      case PlaceOpeningStatus.OPEN:
        return $i18n.t('OPENED');
      case PlaceOpeningStatus.PARTIALLY_OPEN:
        return $i18n.t('PARTIALLY_OPENED');
      case PlaceOpeningStatus.CLOSED:
        return $i18n.t('CLOSED');
      case PlaceOpeningStatus.TEMPORARILY_CLOSED:
        return $i18n.t('TEMPORARILY_CLOSED');
      case PlaceStatus.DRAFT:
        return $i18n.t('DRAFT');
      case PlaceStatus.OFFLINE:
        return $i18n.t('OFFLINE');
      case PlaceStatus.PERMANENTLY_CLOSED:
        return $i18n.t('PERMANENTLY_CLOSED');
      default:
        return $i18n.t('HOURS_NOT_SET');
    }
  };

  const isPlaceStatusUnavailable = (status: PlaceStatus | null): status is PlaceStatus => {
    return (
      status === PlaceStatus.DRAFT ||
      status === PlaceStatus.OFFLINE ||
      status === PlaceStatus.PERMANENTLY_CLOSED
    );
  };

  const resolveDisplayStatus = (
    openingStatusValue: PlaceOpeningStatus,
    placeStatusValue: PlaceStatus | null
  ): DisplayStatus => {
    if (openingStatusValue !== PlaceOpeningStatus.UNKNOWN) {
      return openingStatusValue;
    }

    if (isPlaceStatusUnavailable(placeStatusValue)) {
      return placeStatusValue;
    }

    return PlaceOpeningStatus.UNKNOWN;
  };

  let displayStatus: DisplayStatus;

  $: displayStatus = resolveDisplayStatus(openingStatus, placeStatus);
  $: tagVariant = getTagVariant(displayStatus);
  $: tagLabel = getTagLabel(displayStatus);
</script>

<Tag variant={tagVariant} type={displayStatus === 'unknown' ? 'display' : 'badge'}>{tagLabel}</Tag>

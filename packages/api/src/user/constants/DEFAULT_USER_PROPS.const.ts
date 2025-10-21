/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { UserStatus } from "@soliguide/common";
import { EmailEvents, ModelWithId, User } from "../../_models";

export const DEFAULT_USER_PROPS: Pick<
  ModelWithId<User>,
  | "atSync"
  | "blocked"
  | "campaigns"
  | "categoriesLimitations"
  | "devToken"
  | "invitations"
  | "languages"
  | "organizations"
  | "passwordToken"
  | "phone"
  | "selectedOrgaIndex"
  | "status"
  | "territories"
  | "title"
  | "translator"
  | "verified"
  | "verifiedAt"
> = {
  atSync: {
    airtableId: "",
    excluded: false,
    lastSync: null,
  },
  blocked: false,
  campaigns: {
    MAJ_ETE_2022: {
      CAMPAGNE_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      CAMPAGNE_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_CAMPAGNE_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_CAMPAGNE_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_DESESPOIR_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_DESESPOIR_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_TERMINER_MAJ: {
        done: false,
        ready: false,
        sendDate: null,
      },
      lastEmailStatus: EmailEvents.TO_SEND,
    },
    MAJ_ETE_2023: {
      CAMPAGNE_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      CAMPAGNE_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_CAMPAGNE_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_CAMPAGNE_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_DESESPOIR_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_DESESPOIR_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_TERMINER_MAJ: {
        done: false,
        ready: false,
        sendDate: null,
      },
      lastEmailStatus: EmailEvents.TO_SEND,
    },
    MAJ_ETE_2024: {
      CAMPAGNE_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      CAMPAGNE_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_CAMPAGNE_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_CAMPAGNE_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_DESESPOIR_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_DESESPOIR_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_TERMINER_MAJ: {
        done: false,
        ready: false,
        sendDate: null,
      },
      lastEmailStatus: EmailEvents.TO_SEND,
    },
    MAJ_HIVER_2022: {
      CAMPAGNE_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      CAMPAGNE_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_CAMPAGNE_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_CAMPAGNE_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_DESESPOIR_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_DESESPOIR_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_TERMINER_MAJ: {
        done: false,
        ready: false,
        sendDate: null,
      },
      lastEmailStatus: EmailEvents.TO_SEND,
    },
    MAJ_HIVER_2023: {
      CAMPAGNE_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      CAMPAGNE_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_CAMPAGNE_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_CAMPAGNE_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_DESESPOIR_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_DESESPOIR_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_TERMINER_MAJ: {
        done: false,
        ready: false,
        sendDate: null,
      },
      lastEmailStatus: EmailEvents.TO_SEND,
    },
    END_YEAR_2024: {
      CAMPAGNE_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      CAMPAGNE_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_CAMPAGNE_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_CAMPAGNE_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_DESESPOIR_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_DESESPOIR_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_TERMINER_MAJ: {
        done: false,
        ready: false,
        sendDate: null,
      },
      lastEmailStatus: EmailEvents.TO_SEND,
    },
    MID_YEAR_2025: {
      CAMPAGNE_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      CAMPAGNE_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_CAMPAGNE_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_CAMPAGNE_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_DESESPOIR_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_DESESPOIR_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_TERMINER_MAJ: {
        done: false,
        ready: false,
        sendDate: null,
      },
      lastEmailStatus: EmailEvents.TO_SEND,
    },
    END_YEAR_2025: {
      CAMPAGNE_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      CAMPAGNE_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_CAMPAGNE_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_CAMPAGNE_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_DESESPOIR_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_DESESPOIR_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_TERMINER_MAJ: {
        done: false,
        ready: false,
        sendDate: null,
      },
      lastEmailStatus: EmailEvents.TO_SEND,
    },
    UKRAINE_2022: {
      _id: undefined,
      CAMPAGNE_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      CAMPAGNE_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_CAMPAGNE_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_CAMPAGNE_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_DESESPOIR_COMPTES_PRO: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_DESESPOIR_INVITATIONS: {
        done: false,
        ready: false,
        sendDate: null,
      },
      RELANCE_TERMINER_MAJ: {
        done: false,
        ready: false,
        sendDate: null,
      },
      lastEmailStatus: EmailEvents.TO_SEND,
    },
  },
  categoriesLimitations: [],
  devToken: null,
  invitations: [],
  languages: [],
  organizations: [],
  passwordToken: null,
  phone: null,
  selectedOrgaIndex: 0,
  status: UserStatus.SIMPLE_USER,
  territories: [],
  title: null,
  translator: false,
  verified: false,
  verifiedAt: null,
};

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
import type { NextFunction } from "express";
import type { ExpressRequest, ExpressResponse } from "../../_models";
import { updateUser } from "../services/users.service";
import { updateOrga } from "../../organization/services/organization.service";

/**
 * Checks if the lastLogin date is from a different day than today
 */
const shouldUpdateLastLogin = (lastLogin: Date | null): boolean => {
  if (!lastLogin) {
    return true;
  }

  const today = new Date();
  const lastLoginDate = new Date(lastLogin);

  // Check if dates are from different days
  return (
    today.getFullYear() !== lastLoginDate.getFullYear() ||
    today.getMonth() !== lastLoginDate.getMonth() ||
    today.getDate() !== lastLoginDate.getDate()
  );
};

/**
 * Middleware that updates user and organization lastLogin once per day
 */
export const updateLastLogin = async (
  req: ExpressRequest,
  _res: ExpressResponse,
  next: NextFunction
) => {
  try {
    if (!req.user.isLogged()) {
      return next();
    }

    const now = new Date();

    // Update user lastLogin if needed
    if (shouldUpdateLastLogin(req.user.lastLogin)) {
      req.log.info(
        { userId: req.user._id, currentLastLogin: req.user.lastLogin },
        "Updating user lastLogin"
      );
      await updateUser(
        { _id: req.user._id },
        { lastLogin: now },
        undefined,
        true
      );
      req.log.info({ userId: req.user._id }, "User lastLogin updated");
    } else {
      req.log.debug(
        { userId: req.user._id, lastLogin: req.user.lastLogin },
        "User lastLogin already updated today"
      );
    }

    // Update organization lastLogin if user has organizations
    if (
      req.user.organizations.length > 0 &&
      req.user.selectedOrgaIndex !== undefined
    ) {
      const currentOrg = req.user.organizations[req.user.selectedOrgaIndex];

      if (currentOrg && shouldUpdateLastLogin(currentOrg.lastLogin)) {
        req.log.info(
          { orgId: currentOrg._id, currentLastLogin: currentOrg.lastLogin },
          "Updating organization lastLogin"
        );
        await updateOrga(
          { _id: currentOrg._id },
          { lastLogin: now },
          undefined
        );
        req.log.info(
          { orgId: currentOrg._id },
          "Organization lastLogin updated"
        );
      } else if (currentOrg) {
        req.log.debug(
          { orgId: currentOrg._id, lastLogin: currentOrg.lastLogin },
          "Organization lastLogin already updated today"
        );
      }
    }

    next();
  } catch (error) {
    req.log.error(error, "Error updating lastLogin");
    next();
  }
};

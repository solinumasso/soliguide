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
import express, { type NextFunction } from "express";

import { UserStatus, validateUserStatusWithEmail } from "@soliguide/common";

import * as AuthController from "../controllers/auth.controller";
import * as PasswordController from "../controllers/password.controller";
import * as UserController from "../controllers/user.controller";

import {
  changeMyOrgaDto,
  emailValidDto,
  forgotPasswordDto,
  patchMyAccountDto,
  patchUserDto,
  patchUserFromContactDto,
  pwdResetDto,
  signinDto,
  signupDto,
  signupTranslatorDto,
} from "../dto";

import { sendUserForAuth } from "../utils";

import {
  type ExpressRequest,
  type ExpressResponse,
  type SignupUser,
  UserFactory,
} from "../../_models";

import {
  tokenPasswordGuard,
  getFilteredData,
  getUserFromUrl,
  canEditUser,
  checkRights,
} from "../../middleware";
import {
  sendResetPasswordToMqAndNext,
  sendResetedPasswordToMqAndNext,
} from "../middlewares/send-user-event-to-mq.middleware";
import {
  capturePasswordReset,
  capturePasswordResetToken,
} from "../middlewares/capture-user-event.middleware";
import { addAreasToUser } from "../middlewares/add-areas-to-user.middleware";
import { sendUserChangesToMq } from "../middlewares/send-user-changes-event-to-mq.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: All the routes linked to users
 */

/**
 * @swagger
 *
 * /users/me:
 *   get:
 *     description: get the current user
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User
 *       401 :
 *         description: NOT_LOGGED
 */
router.get("/me", (req: ExpressRequest, res: ExpressResponse) => {
  if (req.user.isLogged()) {
    const user = sendUserForAuth(req.user);
    return res.status(200).json(user);
  }

  return res.status(401).send({ message: "NOT_LOGGED" });
});

router.post(
  "/signup",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  signupDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const signupUserPayload = req.bodyValidated as SignupUser & {
        passwordConfirmation: string;
      };

      if (
        validateUserStatusWithEmail(
          signupUserPayload.status,
          signupUserPayload.mail
        ) !== null
      ) {
        return res.status(403).json({ message: "SIGNUP_IMPOSSIBLE" });
      }

      const user = await UserController.signupWithoutInvitation(
        signupUserPayload
      );

      if (!user) {
        return res.status(500).json({ message: "SIGNUP_IMPOSSIBLE" });
      }

      return res.status(200).json(user._id.toString());
    } catch (e) {
      req.log.error(e);
      return res.status(500).json({ message: "SIGNUP_IMPOSSIBLE" });
    }
  }
);

router.post(
  "/signup-translator",
  signupTranslatorDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const payload = {
        ...req.bodyValidated,
        status: UserStatus.SIMPLE_USER,
      };
      const user = await UserController.signupWithoutInvitation(payload);

      if (user) {
        return res.status(200).json({ message: "SIGNUP_SUCCESSFULLY" });
      }
    } catch (e) {
      req.log.error(e);
    }
    return res.status(500).json({ message: "SIGNUP_IMPOSSIBLE" });
  }
);

/**
 * @swagger
 *
 * /users/signin:
 *   post:
 *     description: return the user corresponding to the signin form
 *     tags: [Users]
 *     parameters:
 *       - name: mail
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         in: formData
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Token, User
 */
router.post(
  "/signin",
  signinDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const tokenAndUser = await AuthController.login(req.bodyValidated);

      if (!tokenAndUser.user.verified) {
        return res.status(401).json("USER_NOT_VERIFIED");
      }

      return res.status(200).json(tokenAndUser);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  }
);

/**
 * @swagger
 *
 * /users/forgot-password:
 *   post:
 *     description: send an email to make a user change his/her password OR generate a reset token for admin use
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: mail
 *         in: formData
 *         required: true
 *         type: string
 *       - name: isAdminRequest
 *         in: formData
 *         required: false
 *         type: boolean
 *         description: Set to true to bypass email sending (admin use)
 *     responses:
 *       200:
 *         description: MAIL_SENT or passwordToken
 *       400 :
 *         description: BAD_REQUEST
 */
router.post(
  "/forgot-password",
  forgotPasswordDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const { mail, isAdminRequest } = req.bodyValidated;

      if (isAdminRequest && !req.isAdmin) {
        return res.status(500).json({ message: "BAD_REQUEST" });
      }

      const selectedUser = await PasswordController.generateResetPasswordToken(
        mail
      );

      if (!selectedUser) {
        req.log.error({
          email: mail,
          message: "TENTATIVE_RESET_PASSWORD_ACCOUNT",
        });
        return res.status(200).json({ message: "EMAIL_RESET_PASSWORD_OK" });
      }
      req.selectedUser = selectedUser;

      if (isAdminRequest) {
        return res
          .status(200)
          .json({ passwordToken: selectedUser.passwordToken });
      } else {
        next();
      }
    } catch (e) {
      req.log.error(e);
      return res.status(500).json({ message: "RESET_PASSWORD_IMPOSSIBLE" });
    }
  },
  sendResetPasswordToMqAndNext,
  (_req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    res.status(200).json({ message: "EMAIL_PASSWORD_TOKEN_SENT" });
    next();
  },
  capturePasswordResetToken
);

/**
 * @swagger
 *
 * /users/check-password-token/:token:
 *   get:
 *     description: check if the password token is (still) correct
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: true
 *       400 :
 *         description: false
 */
router.get(
  "/check-password-token/:passwordToken",
  tokenPasswordGuard,
  (_req: ExpressRequest, res: ExpressResponse) => {
    return res.status(200).json(true);
  }
);

/**
 * @swagger
 *
 * users/reset-password:
 *   post:
 *     description: update the user's password
 *     tags: [Users]
 */
router.post(
  "/reset-password/:passwordToken",
  tokenPasswordGuard,
  pwdResetDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const userPwdInfos = req.bodyValidated;
    try {
      const user = await PasswordController.patchPassword(
        userPwdInfos.password,
        userPwdInfos.token
      );
      if (!user) {
        throw new Error("FAILED_PASSWORD_UPDATE");
      }
      req.selectedUser = user;
      return next();
    } catch (e) {
      req.log.error(e);
      return res.status(400).json("UPDATE_PASSWORD_IMPOSSIBLE");
    }
  },
  sendResetedPasswordToMqAndNext,
  (_req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    res.status(200).json({ message: "EMAIL_PASSWORD_RESETED_SENT" });
    next();
  },
  capturePasswordReset
);

/**
 * @swagger
 *
 * /users/{id}:
 *   get:
 *     description: get an user
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User
 *       400 :
 *         description: BAD_REQUEST
 */

router.get(
  "/:userObjectId",
  getUserFromUrl,
  canEditUser,
  (req: ExpressRequest, res: ExpressResponse) => {
    if (req.selectedUser) {
      return res.status(200).json(sendUserForAuth(req.selectedUser));
    }
    return res.status(400).json({ message: "USER_NOT_FOUND" });
  }
);

/**
 * @swagger
 *
 * /users/{id}:
 *   patch:
 *     description: modify the user infos
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: USER_UPDATED
 *       400 :
 *         description: BAD_REQUEST
 */

router.patch(
  "/me",
  patchMyAccountDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const patchedUser = await UserController.patchUserAccount(
        req.user._id,
        req.bodyValidated
      );
      if (patchedUser) {
        patchedUser.type = req.user.type;
      }
      req.user = UserFactory.createUser(patchedUser!);
      req.updatedUser = req.user;

      res.status(200).json(req.user);
      return next();
    } catch (e) {
      req.log.error(e);
      return res.status(500).json({ message: "PATCH_ME_FAIL" });
    }
  },
  sendUserChangesToMq
);

router.patch(
  "/current-orga",
  changeMyOrgaDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const user = await UserController.patchUserAccount(req.user._id, {
        selectedOrgaIndex: req.bodyValidated.index,
      });
      if (user) {
        return res.status(200).json(sendUserForAuth(user));
      }
    } catch (e) {
      req.log.error(e);
    }
    return res.status(500).json({ message: "SELECTED_ORGA_FAIL" });
  }
);

router.post(
  "/test-email-exist",
  emailValidDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const user = await UserController.getUserByEmail(req.bodyValidated.mail);
      return res.status(200).json(!!user);
    } catch (e) {
      req.log.error(e, "/test-email-exist");
      return res.status(400).json({ message: "TEST_EMAIL_FAIL" });
    }
  }
);

/**
 * @swagger
 *
 * /users/{id}:
 *   patch:
 *     description: modify the user infos
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: USER_UPDATED
 *       400 :
 *         description: UPDATE_USER_ERROR
 */

router.patch(
  "/user-contact/:userObjectId",
  getUserFromUrl,
  canEditUser,
  patchUserFromContactDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const user = await UserController.patchUserAccount(
        req.params.userObjectId,
        req.bodyValidated
      );

      if (user) {
        req.updatedUser = user;
      }

      res.status(200).json({ message: "USER_UPDATED" });

      return next();
    } catch (e) {
      req.log.error(e, "PATCH_USER_FAIL");
      return res.status(500).json({ message: "PATCH_USER_FAIL" });
    }
  },
  sendUserChangesToMq
);

/**
 * @swagger
 *
 * /users/{id}:
 *   patch:
 *     description: modify the user infos
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: USER_UPDATED
 *       400 :
 *         description: UPDATE_USER_ERROR
 */

router.patch(
  "/:userObjectId",
  getUserFromUrl,
  canEditUser,
  patchUserDto,
  getFilteredData,
  addAreasToUser,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const user = await UserController.patchUserAccount(
        req.params.userObjectId,
        req.bodyValidated
      );
      if (!user) {
        throw new Error("Patch returned null");
      }

      req.selectedUser = user;
      req.updatedUser = user;

      res.status(200).json({ message: "USER_UPDATED" });

      return next();
    } catch (e) {
      req.log.error(e, "PATCH_USER_FAIL");
      return res.status(500).json({ message: "PATCH_USER_FAIL" });
    }
  },
  sendUserChangesToMq
);

export default router;

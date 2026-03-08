import { ExpressRequest, Origin } from "../../../_models";

import { generateFullName } from "../../../_utils";

import {
  USER_ADMIN_SOLIGUIDE,
  USER_PRO,
  ORIGIN_SOLIGUIDE_REQUEST,
  ORIGIN_SOLINUM_ORG_REQUEST,
  USER_NOT_LOGGED,
  ORIGIN_MOBILE_APP_REQUEST,
  ORIGIN_UNDEFINED_REQUEST,
} from "../../../../mocks";
import {
  SupportedLanguagesCode,
  UserRole,
  UserStatus,
} from "@soliguide/common";
import { getUserForLogs } from "../services";

describe("getUserForLogs", () => {
  describe("Language handling", () => {
    describe("with params.lang", () => {
      it("should use params.lang when available", () => {
        expect(
          getUserForLogs({
            ...ORIGIN_SOLIGUIDE_REQUEST,
            params: { lang: SupportedLanguagesCode.ES },
            user: USER_NOT_LOGGED,
          } as unknown as ExpressRequest)
        ).toEqual({
          orgaId: null,
          orgaName: null,
          origin: "SOLIGUIDE",
          referrer: null,
          role: null,
          status: "NOT_LOGGED",
          territory: null,
          user_id: null,
          language: SupportedLanguagesCode.ES,
        });
      });

      it("should prioritize params.lang over requestInformation.language", () => {
        expect(
          getUserForLogs({
            ...ORIGIN_SOLIGUIDE_REQUEST,
            params: { lang: SupportedLanguagesCode.ES },
            requestInformation: {
              ...ORIGIN_SOLIGUIDE_REQUEST.requestInformation,
              language: SupportedLanguagesCode.EN,
            },
            user: USER_NOT_LOGGED,
          } as unknown as ExpressRequest)
        ).toEqual({
          orgaId: null,
          orgaName: null,
          origin: "SOLIGUIDE",
          referrer: null,
          role: null,
          status: "NOT_LOGGED",
          territory: null,
          user_id: null,
          language: SupportedLanguagesCode.ES,
        });
      });
    });

    describe("with  params.lang invalid values", () => {
      it("should throw an error when params.lang is invalid", () => {
        expect(() =>
          getUserForLogs({
            ...ORIGIN_SOLIGUIDE_REQUEST,
            params: { lang: "INVALID" as SupportedLanguagesCode },
            user: USER_NOT_LOGGED,
          } as unknown as ExpressRequest)
        ).toThrow("Language not supported");
      });

      it("should throw an error for connected user with invalid language", () => {
        expect(() =>
          getUserForLogs({
            ...ORIGIN_SOLINUM_ORG_REQUEST,
            params: { lang: "INVALID" as SupportedLanguagesCode },
            user: USER_ADMIN_SOLIGUIDE,
          } as unknown as ExpressRequest)
        ).toThrow("Language not supported");
      });
    });

    describe("fallback behavior", () => {
      it("should use requestInformation.language when params.lang is missing", () => {
        expect(
          getUserForLogs({
            ...ORIGIN_SOLIGUIDE_REQUEST,
            requestInformation: {
              ...ORIGIN_SOLIGUIDE_REQUEST.requestInformation,
              language: SupportedLanguagesCode.CA,
            },
            user: USER_NOT_LOGGED,
          } as unknown as ExpressRequest)
        ).toEqual({
          orgaId: null,
          orgaName: null,
          origin: "SOLIGUIDE",
          referrer: null,
          role: null,
          status: "NOT_LOGGED",
          territory: null,
          user_id: null,
          language: SupportedLanguagesCode.CA,
        });
      });

      it("should default FR if no language is specified", () => {
        expect(
          getUserForLogs({
            ...ORIGIN_SOLIGUIDE_REQUEST,
            params: {},
            requestInformation: {
              ...ORIGIN_SOLIGUIDE_REQUEST.requestInformation,
              language: undefined,
            },
            user: USER_NOT_LOGGED,
          } as unknown as ExpressRequest)
        ).toEqual({
          orgaId: null,
          orgaName: null,
          origin: "SOLIGUIDE",
          referrer: null,
          role: null,
          status: "NOT_LOGGED",
          territory: null,
          user_id: null,
          language: SupportedLanguagesCode.FR,
        });
      });
    });

    describe("connected users with language", () => {
      it("should handle Pro user with params.lang", () => {
        expect(
          getUserForLogs({
            ...ORIGIN_SOLIGUIDE_REQUEST,
            params: { lang: SupportedLanguagesCode.ES },
            user: USER_PRO,
          } as unknown as ExpressRequest)
        ).toEqual({
          language: SupportedLanguagesCode.ES,
          email: USER_PRO.mail,
          orgaId: USER_PRO.organizations[0].organization_id,
          orgaName: USER_PRO.organizations[0].name,
          origin: "SOLIGUIDE",
          referrer: null,
          role: null,
          status: USER_PRO.status,
          territory: USER_PRO.territories[0],
          userName: generateFullName(USER_PRO.name, USER_PRO.lastname),
          user_id: USER_PRO.user_id,
        });
      });

      it("should handle Admin user with both params.lang and requestInformation.language", () => {
        expect(
          getUserForLogs({
            ...ORIGIN_SOLINUM_ORG_REQUEST,
            params: { lang: SupportedLanguagesCode.ES },
            requestInformation: {
              ...ORIGIN_SOLINUM_ORG_REQUEST.requestInformation,
              language: SupportedLanguagesCode.EN,
            },
            user: USER_ADMIN_SOLIGUIDE,
          } as unknown as ExpressRequest)
        ).toEqual({
          email: USER_ADMIN_SOLIGUIDE.mail,
          orgaId: null,
          orgaName: null,
          origin: "SOLINUM_ORG",
          language: SupportedLanguagesCode.ES,
          referrer: null,
          role: null,
          status: USER_ADMIN_SOLIGUIDE.status,
          territory: USER_ADMIN_SOLIGUIDE.territories[0],
          userName: generateFullName(
            USER_ADMIN_SOLIGUIDE.name,
            USER_ADMIN_SOLIGUIDE.lastname
          ),
          user_id: 123,
        });
      });
    });
  });

  describe("Logs for not logged users", () => {
    it("should create logs for WIDGET_USER on WEBAPP_SOLIGUIDE", () => {
      expect(
        getUserForLogs({
          ...ORIGIN_SOLIGUIDE_REQUEST,
          user: USER_NOT_LOGGED,
          body: { widgetId: "WIDGET_CROIX_ROUGE" },
          requestInformation: {
            ...ORIGIN_SOLIGUIDE_REQUEST.requestInformation,
            language: SupportedLanguagesCode.FR,
            originForLogs: Origin.WIDGET_SOLIGUIDE,
            referer: null,
          },
        } as unknown as ExpressRequest)
      ).toEqual({
        orgaId: null,
        orgaName: "WIDGET_CROIX_ROUGE",
        origin: Origin.WIDGET_SOLIGUIDE,
        referrer: null,
        role: null,
        status: UserStatus.WIDGET_USER,
        territory: null,
        user_id: null,
        userName: "WIDGET_CROIX_ROUGE",
        language: SupportedLanguagesCode.FR,
      });
    });

    it("should create logs for NOT_LOGGED user on MOBILE_APP", () => {
      expect(
        getUserForLogs({
          ...ORIGIN_MOBILE_APP_REQUEST,
          user: USER_NOT_LOGGED,
          requestInformation: {
            ...ORIGIN_MOBILE_APP_REQUEST.requestInformation,
            language: SupportedLanguagesCode.FR,
            originForLogs: Origin.MOBILE_APP,
            referer: null,
          },
        } as unknown as ExpressRequest)
      ).toEqual({
        orgaId: null,
        orgaName: null,
        origin: Origin.MOBILE_APP,
        referrer: null,
        role: null,
        status: "NOT_LOGGED",
        territory: null,
        user_id: null,
        language: SupportedLanguagesCode.FR,
      });
    });

    it("should create logs for NOT_LOGGED user on ORIGIN_UNDEFINED", () => {
      expect(
        getUserForLogs({
          ...ORIGIN_UNDEFINED_REQUEST,
          user: USER_NOT_LOGGED,
          requestInformation: {
            ...ORIGIN_UNDEFINED_REQUEST.requestInformation,
            language: SupportedLanguagesCode.FR,
            originForLogs: Origin.ORIGIN_UNDEFINED,
            referer: null,
          },
        } as unknown as ExpressRequest)
      ).toEqual({
        orgaId: null,
        orgaName: null,
        origin: Origin.ORIGIN_UNDEFINED,
        referrer: null,
        role: null,
        status: "NOT_LOGGED",
        territory: null,
        user_id: null,
        language: SupportedLanguagesCode.FR,
      });
    });
  });

  describe("Organization handling for logged users", () => {
    it("should handle user PRO with no organization", () => {
      const userWithoutOrganizations = {
        ...USER_PRO,
        organizations: [],
        userRights: [],
      };

      expect(
        getUserForLogs({
          ...ORIGIN_SOLIGUIDE_REQUEST,
          user: userWithoutOrganizations,
          requestInformation: {
            ...ORIGIN_SOLIGUIDE_REQUEST.requestInformation,
            language: SupportedLanguagesCode.FR,
            originForLogs: Origin.SOLIGUIDE,
            referer: null,
          },
        } as unknown as ExpressRequest)
      ).toEqual({
        email: "mail-user-pro@structure.fr",
        orgaId: null,
        orgaName: null,
        origin: Origin.SOLIGUIDE,
        referrer: null,
        role: null,
        status: UserStatus.PRO,
        territory: "75",
        userName: "Marcel Nom-pro",
        user_id: 451,
        language: SupportedLanguagesCode.FR,
      });
    });

    it("should handle user with multiple organizations and matching userRights", () => {
      const userWithMultipleOrgs = {
        ...USER_PRO,
        organizations: [
          {
            _id: "5fb648823cb90874d9ab1bef",
            name: "Organisme 1",
            organization_id: 2316,
            territories: ["75"],
          },
          {
            _id: "5fb648823cb90874d9ab1bf0",
            name: "Organisme 2",
            organization_id: 2317,
            territories: ["92"],
          },
        ],
        selectedOrgaIndex: 1,
        userRights: [
          { organization_id: 2316, role: UserRole.OWNER },
          { organization_id: 2317, role: UserRole.EDITOR },
        ],
      };

      expect(
        getUserForLogs({
          ...ORIGIN_SOLIGUIDE_REQUEST,
          user: userWithMultipleOrgs,
          requestInformation: {
            ...ORIGIN_SOLIGUIDE_REQUEST.requestInformation,
            language: SupportedLanguagesCode.FR,
            originForLogs: Origin.SOLIGUIDE,
            referer: null,
          },
        } as unknown as ExpressRequest)
      ).toEqual({
        email: "mail-user-pro@structure.fr",
        orgaId: 2317,
        orgaName: "Organisme 2",
        origin: Origin.SOLIGUIDE,
        referrer: null,
        role: UserRole.EDITOR,
        status: UserStatus.PRO,
        territory: "92",
        userName: "Marcel Nom-pro",
        user_id: 451,
        language: SupportedLanguagesCode.FR,
      });
    });
  });
});

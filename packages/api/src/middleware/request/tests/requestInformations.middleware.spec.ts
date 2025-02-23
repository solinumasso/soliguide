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

import { CONFIG, ExpressRequest, ExpressResponse } from "../../../_models";
import { handleRequest } from "../requestInformation.middleware";

describe("handleRequest", () => {
  it("Test referer not given", () => {
    const req = {
      get: jest.fn().mockImplementation((name) => {
        if (name === "origin") return "https://soliguide.fr";
        if (name === "referer") return;
        if (name === "x-document-referrer") return;
        return null;
      }),
    } as unknown as ExpressRequest;

    const res = {} as ExpressResponse;
    const next = () => {};
    handleRequest(req, res, next);
    expect(req.requestInformation.referer).toEqual(null);

    CONFIG.ENV = "test";
  });

  it("Test referer given", () => {
    const req = {
      get: jest.fn().mockImplementation((name) => {
        if (name === "origin") return "https://soliguide.fr";
        if (name === "x-document-referrer") return;
        if (name === "referer") return "https://soliguide.fr";
        return null;
      }),
    } as unknown as ExpressRequest;

    const res = {} as ExpressResponse;
    const next = () => {};
    handleRequest(req, res, next);
    expect(req.requestInformation.referer).toEqual("https://soliguide.fr");

    CONFIG.ENV = "test";
  });

  it("Test x-document-referrer given", () => {
    const req = {
      get: jest.fn().mockImplementation((name) => {
        if (name === "origin") {
          return "https://soliguide.fr";
        }
        if (name === "x-document-referrer") {
          return "https://soliguide.fr";
        }
        if (name === "referer") {
          return "https://soliguide.com";
        }
        return null;
      }),
    } as unknown as ExpressRequest;

    const res = {} as ExpressResponse;
    const next = () => {};
    handleRequest(req, res, next);
    expect(req.requestInformation.referer).toEqual("https://soliguide.fr");

    CONFIG.ENV = "test";
  });

  it("Test of origin and frontUrl", () => {
    const req = {
      get: jest
        .fn()
        .mockImplementation((name) =>
          name === "origin" ? "https://soliguide.fr" : null
        ),
    } as unknown as ExpressRequest;

    const res = {} as ExpressResponse;
    const next = () => {};
    handleRequest(req, res, next);
    expect(req.requestInformation.origin).toEqual("https://soliguide.fr");
    expect(req.requestInformation.frontendUrl).toEqual("https://soliguide.fr/");

    CONFIG.ENV = "test";
  });
  it("Test originForLogs SOLIGUIDE", () => {
    const req = {
      get: jest
        .fn()
        .mockImplementation((name) =>
          name === "origin" ? "https://soliguide.fr" : null
        ),
    } as unknown as ExpressRequest;

    const res = {} as ExpressResponse;
    const next = () => {};
    handleRequest(req, res, next);
    expect(req.requestInformation.originForLogs).toEqual("SOLIGUIDE");

    CONFIG.ENV = "test";
  });

  it("Test originForLogs ORIGIN_UNDEFINED", () => {
    const req = {
      get: jest
        .fn()
        .mockImplementation((name) =>
          name === "origin" ? "https://google.fr" : null
        ),
    } as unknown as ExpressRequest;

    const res = {} as ExpressResponse;
    const next = () => {};
    handleRequest(req, res, next);
    expect(req.requestInformation.originForLogs).toEqual("ORIGIN_UNDEFINED");

    CONFIG.ENV = "test";
  });

  it("Test originForLogs MOBILE_APP", () => {
    const req = {
      headers: {
        "user-agent":
          "Soliguide Webview App ; Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      },
      get: jest
        .fn()
        .mockImplementation((name) =>
          name === "origin" ? "https://solinum.org" : null
        ),
    } as unknown as ExpressRequest;

    const res = {} as ExpressResponse;
    const next = () => {};
    handleRequest(req, res, next);
    expect(req.requestInformation.originForLogs).toEqual("MOBILE_APP");

    CONFIG.ENV = "test";
  });

  it("Test originForLogs with wrong user-agent", () => {
    const req = {
      headers: { "user-agent": "Random Browser User Agent" },
      get: jest
        .fn()
        .mockImplementation((name) =>
          name === "origin" ? "https://solinum.org" : null
        ),
    } as unknown as ExpressRequest;

    const res = {} as ExpressResponse;
    const next = () => {};
    handleRequest(req, res, next);
    expect(req.requestInformation.originForLogs).toEqual("SOLINUM_ORG");

    CONFIG.ENV = "test";
  });

  it("Test originForLogs SOLINUM_ORG", () => {
    const req = {
      get: jest
        .fn()
        .mockImplementation((name) =>
          name === "origin" ? "https://solinum.org" : null
        ),
    } as unknown as ExpressRequest;

    const res = {} as ExpressResponse;
    const next = () => {};
    handleRequest(req, res, next);
    expect(req.requestInformation.originForLogs).toEqual("SOLINUM_ORG");

    CONFIG.ENV = "test";
  });

  it("Test originForLogs WIDGET_SOLIGUIDE", () => {
    const req = {
      get: jest
        .fn()
        .mockImplementation((name) =>
          name === "origin" ? `${CONFIG.WIDGET_URL}/crf` : null
        ),
    } as unknown as ExpressRequest;

    const res = {} as ExpressResponse;
    const next = () => {};
    handleRequest(req, res, next);
    expect(req.requestInformation.originForLogs).toEqual("WIDGET_SOLIGUIDE");

    CONFIG.ENV = "test";
  });
});

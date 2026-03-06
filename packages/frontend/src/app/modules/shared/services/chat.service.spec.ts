import { TestBed } from "@angular/core/testing";

import { DOCUMENT } from "@angular/common";

import { ChatService } from "./chat.service";

import { USER_PRO_MOCK } from "../../../../../mocks/USER_PRO.mock";
import { User } from "../../users/classes";
import { THEME_CONFIGURATION } from "../../../models";
import {
  MockAuthService,
  MockCookieManagerService,
} from "../../../../../mocks";
import { AuthService } from "../../users/services/auth.service";
import { CookieManagerService } from "./cookie-manager.service";

describe("ChatService", () => {
  let service: ChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChatService,
        { provide: DOCUMENT, useValue: global.document },
        { provide: AuthService, useClass: MockAuthService },
        { provide: CookieManagerService, useClass: MockCookieManagerService },
      ],
    });

    service = TestBed.inject(ChatService);
  });

  afterEach(() => {
    // Make sure to restore default settings
    THEME_CONFIGURATION.chatWebsiteId = undefined;
  });

  it("should be created", () => {
    service = TestBed.inject(ChatService);
    expect(service).toBeTruthy();
  });

  it("should setup chat for pro", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).$zE = (element: string, action: string) => {
      console.log(`${action} on ${element}: done`);
    };

    const spyChatSetup = jest.spyOn(service, "setupChat");
    service.setupChat(new User(USER_PRO_MOCK));
    expect(spyChatSetup).toHaveBeenCalled();
  });

  it("should open chat for pro", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).$zE = (element: string, action: string) => {
      console.log(`${action} on ${element}: done`);
    };

    const spyOpenChat = jest.spyOn(service, "openChat");
    service.openChat();
    expect(spyOpenChat).toHaveBeenCalled();
  });

  it("should reset chat for pro", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).$zE = (element: string, action: string) => {
      console.log(`${action} on ${element}: done`);
    };

    const spyResetSession = jest.spyOn(service, "resetSession");
    service.resetSession();
    expect(spyResetSession).toHaveBeenCalled();
  });
});

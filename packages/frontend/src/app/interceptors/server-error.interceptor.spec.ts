import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";

import { environment } from "../../environments/environment";
import { AuthService } from "../modules/users/services/auth.service";
import { ServerErrorInterceptor } from "./server-error.interceptor";

describe("ServerErrorInterceptor", () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let authService: { logoutAndRedirect: jest.Mock };
  let toastrService: { warning: jest.Mock };

  beforeEach(() => {
    authService = {
      logoutAndRedirect: jest.fn(),
    };
    toastrService = {
      warning: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: ToastrService,
          useValue: toastrService,
        },
        {
          provide: TranslateService,
          useValue: {
            instant: (key: string) => key,
          },
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ServerErrorInterceptor,
          multi: true,
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("does not redirect when the auth status endpoint returns 401", () => {
    httpClient.get(`${environment.apiUrl}/users/me`).subscribe({
      error: () => undefined,
    });

    const request = httpTestingController.expectOne(
      `${environment.apiUrl}/users/me`
    );

    request.flush({ message: "NOT_LOGGED" }, { status: 401, statusText: "" });

    expect(toastrService.warning).not.toHaveBeenCalled();
    expect(authService.logoutAndRedirect).not.toHaveBeenCalled();
  });

  it("redirects when another endpoint returns 401", () => {
    httpClient.get(`${environment.apiUrl}/admin/users`).subscribe({
      error: () => undefined,
    });

    const request = httpTestingController.expectOne(
      `${environment.apiUrl}/admin/users`
    );

    request.flush(
      { message: "INVALID_TOKEN" },
      { status: 401, statusText: "" }
    );

    expect(toastrService.warning).toHaveBeenCalledWith("EXPIRED_SESSION");
    expect(authService.logoutAndRedirect).toHaveBeenCalled();
  });
});

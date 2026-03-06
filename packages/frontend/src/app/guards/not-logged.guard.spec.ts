import { HttpClientTestingModule } from "@angular/common/http/testing";
import { getTestBed, TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, Router, RouterModule } from "@angular/router";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule, ToastrService } from "ngx-toastr";

import { of } from "rxjs";

import { NotAuthGuard } from "./not-logged.guard";

import { AuthService } from "../modules/users/services/auth.service";
import { THEME_CONFIGURATION } from "../models";

describe("NotAuthGuard", () => {
  let injector: TestBed;
  let notAuthGuard: NotAuthGuard;
  let authService: AuthService;
  let route: ActivatedRouteSnapshot;
  let router: Router;
  let toastr: ToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([
          {
            path: THEME_CONFIGURATION.defaultLanguage,
            redirectTo: "",
          },
        ]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [NotAuthGuard],
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    authService = injector.inject(AuthService);
    notAuthGuard = injector.inject(NotAuthGuard);
    router = injector.inject(Router);
    toastr = injector.inject(ToastrService);
    route = new ActivatedRouteSnapshot();
  });

  it("should return 'true' if the user is not logged", () => {
    jest.spyOn(authService, "isAuth").mockReturnValueOnce(of(false));
    notAuthGuard.canActivate(route).subscribe((res) => expect(res).toBe(true));
  });

  it("should return 'false' if the user is logged", () => {
    route.params = { idInvitation: "invitation" };
    jest.spyOn(authService, "isAuth").mockReturnValueOnce(of(true));
    jest.spyOn(router, "navigate");
    jest.spyOn(toastr, "warning");
    notAuthGuard.canActivate(route).subscribe((res) => expect(res).toBe(false));
    expect(router.navigate).toHaveBeenCalled();
    expect(toastr.warning).toHaveBeenCalled();
  });
});

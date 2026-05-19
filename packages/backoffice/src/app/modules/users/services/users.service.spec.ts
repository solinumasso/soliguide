import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { UsersService } from "./users.service";

import { ApiMessage } from "../../../models";

import { environment } from "../../../../environments/environment";
import { CountryCodes } from "@soliguide/common";

describe("UsersService", () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService],
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe("Tests des fonctions pour l'inscription", () => {
    it("S'enregistrer en tant que traducteur", () => {
      service
        .signupTranslator({
          mail: "john.snow@gmail.com",
          name: "JohnSnow",
          lastname: "traducteur",
          password: "",
          translator: true,
          country: CountryCodes.FR,
        })
        .subscribe((response: ApiMessage) => {
          expect(response.message).toBe("");
        });

      const req = httpMock.expectOne(
        `${service.getEndPoint}/signup-translator/`
      );

      expect(req.request.method).toBe("POST");
    });

    it("S'enregistrer en tant qu'utilisateur sans invitation", () => {
      service
        .signup({
          mail: "john.snow@gmail.com",
          name: "John",
          lastname: "Snow",
          password: "",
          country: CountryCodes.FR,
        })
        .subscribe((response: string) => {
          expect(response).toBe("");
        });

      const req = httpMock.expectOne(`${service.getEndPoint}/signup/`);

      expect(req.request.method).toBe("POST");
    });

    it("S'enregistrer en tant qu'utilisateur avec une invitation", () => {
      const DUMMY_INVIT = "6043bd63cc16136fe406049a";

      service
        .signup({
          invitation: DUMMY_INVIT,
          mail: "john.snow@gmail.com",
          name: "John",
          lastname: "Snow",
          password: "",
          country: CountryCodes.FR,
        })
        .subscribe((response: string) => {
          expect(response).toBe("");
        });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/invite-user/accept-first-invitation/${DUMMY_INVIT}`
      );

      expect(req.request.method).toBe("POST");
    });
  });
});

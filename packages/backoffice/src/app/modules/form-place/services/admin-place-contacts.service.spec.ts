import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { ToastrModule } from "ngx-toastr";
import { TranslateModule } from "@ngx-translate/core";

import { AdminPlaceContactsService } from "./admin-place-contacts.service";

import { PlaceContactsService } from "../../place/services/place-contacts.service";

describe("AdminPlaceContactsService", () => {
  let service: AdminPlaceContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
        HttpClientTestingModule,
      ],
      providers: [
        PlaceContactsService,
        { provide: APP_BASE_HREF, useValue: "/" },
      ],
    });
    service = TestBed.inject(AdminPlaceContactsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

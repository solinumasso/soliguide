import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { ToastrModule } from "ngx-toastr";
import { TranslateModule } from "@ngx-translate/core";

import { PlaceContactsService } from "./place-contacts.service";

describe("PlaceContactsService", () => {
  let service: PlaceContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        HttpClientTestingModule,
        TranslateModule.forRoot({}),
      ],
      providers: [
        PlaceContactsService,
        { provide: APP_BASE_HREF, useValue: "/" },
      ],
    });
    service = TestBed.inject(PlaceContactsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from "@angular/core/testing";

import { InputLanguagesService } from "./input-languages.service";
import { TranslateModule } from "@ngx-translate/core";

describe("InputLanguagesService", () => {
  let service: InputLanguagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({})],
    });
    service = TestBed.inject(InputLanguagesService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

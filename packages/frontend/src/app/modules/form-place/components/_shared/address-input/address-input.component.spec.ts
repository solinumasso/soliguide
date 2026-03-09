import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TranslateModule } from "@ngx-translate/core";
import { ToastrModule } from "ngx-toastr";
import { AddressInputComponent } from "./address-input.component";
import { PlacePosition } from "../../../../../models";
import { AuthService } from "../../../../users/services/auth.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../../../shared/shared.module";
import { APP_BASE_HREF, CommonModule } from "@angular/common";
import { LocationService } from "../../../../shared/services";
import {
  CommonPosthogMockService,
  MockAuthService,
} from "../../../../../../../mocks";
import { PosthogService } from "../../../../analytics/services/posthog.service";
import { LocationAutocompleteComponent } from "../../../../shared/components/location-autocomplete/location-autocomplete.component";

describe("AddressInputComponent", () => {
  let component: AddressInputComponent;
  let fixture: ComponentFixture<AddressInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressInputComponent],
      imports: [
        CommonModule,
        FormsModule,
        HttpClientTestingModule,
        LocationAutocompleteComponent,
        ReactiveFormsModule,
        SharedModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
      ],
      providers: [
        LocationService,
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PosthogService, useClass: CommonPosthogMockService },
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressInputComponent);
    component = fixture.componentInstance;

    component.position = new PlacePosition();
    component.title = "";
    component.titleError = "";

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

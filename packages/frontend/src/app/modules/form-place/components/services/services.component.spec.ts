import { DragDropModule } from "@angular/cdk/drag-drop";
import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { FormServicesFicheComponent } from "./services.component";
import { SERVICE_MOCK } from "../../../../../../mocks";

describe("FormServicesFicheComponent", () => {
  let component: FormServicesFicheComponent;
  let fixture: ComponentFixture<FormServicesFicheComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormServicesFicheComponent],
      imports: [
        DragDropModule,
        FormsModule,
        HttpClientTestingModule,
        NgbModule,
        TranslateModule.forRoot({}),
        ToastrModule.forRoot({}),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormServicesFicheComponent);
    component = fixture.componentInstance;
    component.services = [SERVICE_MOCK];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("add a new service", () => {
    it("should create a new service", () => {
      component.newService();
      expect(component.services.length).toBe(2);
    });
  });

  describe("remove a service", () => {
    it("shouldn't delete the first service because it's the only one", () => {
      component.deleteService(0);
      expect(component.services.includes(SERVICE_MOCK)).toBe(true);
    });

    it("should remove the first service if we add a new before deleting the first one", () => {
      component.newService();
      component.deleteService(0);
      expect(component.services.includes(SERVICE_MOCK)).toBe(false);
    });
  });

  describe("show a service", () => {
    it("should set show to true for the first service", () => {
      component.showService(0);
      expect(component.services[0].show).toBe(true);
    });
  });

  it("should emit hasError", () => {
    jest.spyOn(component.isDescriptionInvalid, "emit");
    component.handleDescriptionError(true);
    expect(component.isDescriptionInvalid.emit).toBeCalledWith(true);
  });
});

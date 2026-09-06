import { TranslateModule } from "@ngx-translate/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RegistrationScope } from "@soliguide/common";

import { DisplayRegistrationsComponent } from "./display-registrations.component";

describe("DisplayRegistrationsComponent", () => {
  let component: DisplayRegistrationsComponent;
  let fixture: ComponentFixture<DisplayRegistrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayRegistrationsComponent, TranslateModule.forRoot({})],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayRegistrationsComponent);
    component = fixture.componentInstance;
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should only display the schemes of the country that have a value", () => {
    component.registrations = {
      siret: { value: "73282932000074", scope: RegistrationScope.ORGANIZATION },
      nif: { value: "Q2826000H", scope: RegistrationScope.ORGANIZATION },
    };
    fixture.detectChanges();

    expect(component.displayedRegistrations.map((item) => item.scheme)).toEqual(
      ["siret"]
    );
    const html: string = fixture.nativeElement.innerHTML;
    expect(html).toContain("73282932000074");
    expect(html).not.toContain("Q2826000H");
  });

  it("should link the value to its reference website when one exists", () => {
    component.registrations = {
      siret: { value: "73282932000074", scope: RegistrationScope.ORGANIZATION },
    };
    fixture.detectChanges();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector("a");
    expect(link.href).toBe(
      "https://annuaire-entreprises.data.gouv.fr/etablissement/73282932000074"
    );
    expect(link.target).toBe("_blank");
  });

  it("should render nothing without registrations", () => {
    component.registrations = {};
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll(".registration").length).toBe(
      0
    );
  });
});

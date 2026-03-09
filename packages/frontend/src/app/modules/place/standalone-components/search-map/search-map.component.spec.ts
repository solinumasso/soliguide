import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchMapComponent } from "./search-map.component";

describe("SearchMapComponent", () => {
  let component: SearchMapComponent;
  let fixture: ComponentFixture<SearchMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchMapComponent);
    component = fixture.componentInstance;
    component.scrollOnClick = false;
    component.markers = [
      {
        lat: 48.8838122,
        lng: 2.3342526000000134,
        options: {
          icon: {
            url: "../../../../../assets/images/maps/18.png",
            scaledSize: {
              height: 32,
              width: 23,
            },
          },
          id: 44,
          title:
            "Centre d'accueil et de distribution alimentaire Restos du Coeur 18ème Coustou",
        },
      },
    ];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

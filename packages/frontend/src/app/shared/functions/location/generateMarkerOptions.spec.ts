import { generateMarkerOptions } from "./generateMarkerOptions";
import { Place, MarkerOptions } from "../../../models";

import { User } from "../../../modules/users/classes";
import { PlaceType } from "@soliguide/common";

describe("GenerateMarkerOptions", () => {
  const places: Place[] = [
    {
      lieu_id: 1,
      name: "Place 1",
      placeType: PlaceType.PLACE, // non itinerary place
      modalities: {
        orientation: {
          checked: false,
        },
      },
      position: {
        location: {
          type: "Point",
          coordinates: [1, 1],
        },
      },
    } as Place,
    {
      lieu_id: 2,
      name: "Place 2",
      placeType: PlaceType.PLACE, // non itinerary place
      modalities: {
        orientation: {
          checked: false,
        },
      },
      position: {
        location: {
          type: "Point",
          coordinates: [2, 2],
        },
      },
    } as Place,
    {
      lieu_id: 3,
      name: "Place 3",
      placeType: PlaceType.PLACE, // non itinerary place
      modalities: {
        orientation: {
          checked: false,
        },
      },
      position: {
        location: {
          type: "Point",
          coordinates: [3, 3],
        },
      },
    } as Place,
  ];

  const user: User = new User();

  it("Returns empty MarkerOptions array for a default User and an empty array of Places", () => {
    expect(generateMarkerOptions([], user)).toEqual<MarkerOptions[]>([]);
  });

  it("Returns an array with 3 markers", () => {
    expect(generateMarkerOptions(places, user)).toEqual<MarkerOptions[]>([
      {
        lng: 1,
        lat: 1,
        options: {
          id: 1,
          title: "Place 1",
          icon: {
            url: "../../../../../assets/images/maps/1.png",
            scaledSize: {
              width: 23,
              height: 32,
            },
          },
        },
      },
      {
        lat: 2,
        lng: 2,
        options: {
          icon: {
            scaledSize: {
              height: 32,
              width: 23,
            },
            url: "../../../../../assets/images/maps/2.png",
          },
          id: 2,
          title: "Place 2",
        },
      },
      {
        lat: 3,
        lng: 3,
        options: {
          icon: {
            scaledSize: {
              height: 32,
              width: 23,
            },
            url: "../../../../../assets/images/maps/3.png",
          },
          id: 3,
          title: "Place 3",
        },
      },
    ]);
  });

  it("Returns a MarkerOptions array whithout the second place", () => {
    places[1].modalities.orientation.checked = true;
    const expectedMarkers = generateMarkerOptions(places, user);
    expect(expectedMarkers[1].options.title).toEqual("Place 3");
  });

  it("Returns a MarkerOptions array with all places, because user is admin", () => {
    user.admin = true;
    const expectedMarkers = generateMarkerOptions(places, user);
    expect(expectedMarkers[1].options.title).toEqual("Place 2");
  });
});

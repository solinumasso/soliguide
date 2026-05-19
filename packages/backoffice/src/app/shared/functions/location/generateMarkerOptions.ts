import { CommonPlacePosition, PlaceType } from "@soliguide/common";
import { Place, PlaceParcours, MarkerOptions } from "../../../models";
import { User } from "../../../modules/users/classes";

const getMarker = (
  item: Place,
  position: CommonPlacePosition,
  markerCounter: number
): MarkerOptions => {
  return {
    lng: position.location.coordinates[0],
    lat: position.location.coordinates[1],
    options: {
      id: item.lieu_id,
      title: item.name,
      icon: {
        url: `../../../../../assets/images/maps/${markerCounter}.png`,
        scaledSize: {
          width: 23,
          height: 32,
        },
      },
    },
  };
};

export const generateMarkerOptions = (
  places: Place[],
  me: User | null
): MarkerOptions[] => {
  const markers: MarkerOptions[] = [];

  let markerCounter = 1;

  places.forEach((item: Place) => {
    if (item.placeType === PlaceType.ITINERARY) {
      item.parcours.forEach((pointPassage: PlaceParcours) => {
        markers.push(getMarker(item, pointPassage.position, markerCounter));
        markerCounter++;
      });
    } else {
      if (me?.admin || me?.pro || !item.modalities.orientation.checked) {
        markers.push(getMarker(item, item.position, markerCounter));
      }
      markerCounter++;
    }
  });
  return markers;
};

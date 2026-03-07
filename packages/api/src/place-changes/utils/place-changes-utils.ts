import {
  CAMPAIGN_DEFAULT_NAME,
  PlaceChangesSection,
  ApiPlace,
  PlaceType,
  CommonPlaceEntity,
  CommonNewPlaceService,
  CommonPlaceDocument,
  CampaignChangesSection,
} from "@soliguide/common";

import { ApiPlacePhoto } from "../../_models";
import dot from "dot-object";
import { isDeepStrictEqual } from "util";

export const getGeneralInformation = (
  place: ApiPlace | null
): {
  entity: CommonPlaceEntity | null;
  name: string | null;
  description: string | null;
} => {
  return {
    entity: place?.entity ?? null,
    name: place?.name ?? null,
    description: place?.description ?? null,
  };
};

export const getNoChanges = (
  noChanges: boolean,
  section: PlaceChangesSection | CampaignChangesSection,
  newSectionData: Partial<ApiPlace> | null,
  oldSectionData: Partial<ApiPlace> | null
): boolean => {
  if (noChanges) {
    return true;
  } else if (section === PlaceChangesSection.photos) {
    return false;
  }
  return isDeepStrictEqual(newSectionData, oldSectionData);
};

export const cleanDocsForHistory = (
  docs: CommonPlaceDocument[]
): CommonPlaceDocument[] => {
  return docs.length
    ? (docs.map((doc: CommonPlaceDocument) => {
        return {
          filename: doc.filename,
          lieu_id: doc.lieu_id,
          name: doc.name,
        };
      }) as CommonPlaceDocument[])
    : [];
};

export const getPositionByPlaceType = (place: ApiPlace) => {
  if (place.placeType === PlaceType.ITINERARY) {
    return {
      parcours: place.parcours,
      placeType: PlaceType.ITINERARY,
    };
  }
  return {
    placeType: PlaceType.PLACE,
    position: place.position,
  };
};

export const getSectionData = (
  section: PlaceChangesSection | CampaignChangesSection,
  oldPlace: ApiPlace | null,
  updatedPlace: ApiPlace
): {
  newSectionData: Partial<ApiPlace> | null;
  oldSectionData: Partial<ApiPlace> | null;
} => {
  let oldSectionData = null;
  let newSectionData = null;

  if (section !== PlaceChangesSection.place) {
    switch (section) {
      case PlaceChangesSection.new: {
        newSectionData = getGeneralInformation(updatedPlace);
        break;
      }

      case PlaceChangesSection.tempClosure: {
        oldSectionData = oldPlace?.tempInfos;
        newSectionData = updatedPlace.tempInfos;
        break;
      }

      case PlaceChangesSection.tempHours: {
        oldSectionData = oldPlace?.tempInfos;
        newSectionData = updatedPlace.tempInfos;
        break;
      }

      case PlaceChangesSection.tempMessage: {
        oldSectionData = oldPlace?.tempInfos;
        newSectionData = updatedPlace.tempInfos;
        break;
      }

      case PlaceChangesSection.generalinfo: {
        oldSectionData = getGeneralInformation(oldPlace);
        newSectionData = getGeneralInformation(updatedPlace);
        break;
      }

      case PlaceChangesSection.emplacement: {
        oldSectionData = oldPlace ? getPositionByPlaceType(oldPlace) : null;
        newSectionData = getPositionByPlaceType(updatedPlace);

        if (oldSectionData?.parcours?.length) {
          oldSectionData.parcours = oldSectionData.parcours.map((point) => {
            if (point.photos?.length) {
              point.photos = point.photos.map(
                (photo: ApiPlacePhoto) => photo._id
              );
            }
            return point;
          });
        }

        if (newSectionData.parcours?.length) {
          newSectionData.parcours = newSectionData.parcours.map((point) => {
            if (point.photos?.length) {
              point.photos = point.photos.map(
                (photo: ApiPlacePhoto) => photo._id
              );
            }
            return point;
          });
        }
        break;
      }

      case PlaceChangesSection.public: {
        delete updatedPlace.publics.showAge;
        oldSectionData = {
          languages: oldPlace?.languages,
          publics: oldPlace?.publics,
        };
        newSectionData = {
          languages: updatedPlace.languages,
          publics: updatedPlace.publics,
        };
        break;
      }

      case PlaceChangesSection.photos: {
        oldSectionData = oldPlace?.photos.map(
          (photo: ApiPlacePhoto) => photo._id
        );
        newSectionData = updatedPlace.photos.map(
          (photo: ApiPlacePhoto) => photo._id
        );
        break;
      }

      default: {
        const sectionsAvailable: Record<string, string> = {
          CAMPAIGN_SOURCE_MAJ: `campaigns.${CAMPAIGN_DEFAULT_NAME}.source`,
          contacts: "contacts",
          hours: "newhours",
          languages: "languages",
          modalities: "modalities",
          newhours: "newhours",
          photos: "photos",
          remindMe: `campaigns.${CAMPAIGN_DEFAULT_NAME}.remindMeDate`,
          services: "services_all",
          sources: "sources",
          status: "status",
          tempHours: "tempInfos.hours",
          tempInfos: "tempInfos",
          tempMessage: "tempInfos.message",
          visibility: "visibility",
        };

        const field = sectionsAvailable[section];

        // We get the data in the place object
        oldSectionData = dot.pick(field, oldPlace);
        newSectionData = dot.pick(field, updatedPlace);

        switch (field) {
          case "modalities": {
            newSectionData.docs = cleanDocsForHistory(newSectionData.docs);
            oldSectionData.docs = cleanDocsForHistory(oldSectionData.docs);
            break;
          }
          case "services_all": {
            oldSectionData = oldSectionData.length
              ? oldSectionData.map((service: CommonNewPlaceService) => {
                  service.modalities.docs = cleanDocsForHistory(
                    service.modalities?.docs
                  );
                  delete service.publics.showAge;
                  return service;
                })
              : [];
            newSectionData = newSectionData.length
              ? newSectionData.map((service: CommonNewPlaceService) => {
                  service.modalities.docs = cleanDocsForHistory(
                    service.modalities?.docs
                  );
                  delete service.publics.showAge;
                  return service;
                })
              : [];
            break;
          }
          case "newhours": {
            delete oldSectionData.description;
            delete newSectionData.description;
            break;
          }
          default: {
            break;
          }
        }
        break;
      }
    }
  }

  return { newSectionData, oldSectionData };
};

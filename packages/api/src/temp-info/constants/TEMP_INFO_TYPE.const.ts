import { PlaceChangesSection, TempInfoType } from "@soliguide/common";

export const TEMP_INFO_HISTORY_SECTIONS: {
  [key in TempInfoType]: PlaceChangesSection;
} = {
  closure: PlaceChangesSection.tempClosure,
  hours: PlaceChangesSection.tempHours,
  message: PlaceChangesSection.tempMessage,
  serviceClosure: PlaceChangesSection.services,
};

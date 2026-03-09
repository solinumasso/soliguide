import { DEFAULT_SERVICES_TO_EXCLUDE } from "@soliguide/common";

export const DEFAULT_PLACES_TO_EXCLUDE_FOR_SEARCH = {
  $or: [
    { "services_all.1": { $exists: false } },
    {
      "services_all.1.category": { $in: DEFAULT_SERVICES_TO_EXCLUDE },
      "services_all.2": { $exists: false },
    },
  ],
  "services_all.0.category": { $in: DEFAULT_SERVICES_TO_EXCLUDE },
};

export const DEFAULT_PLACES_TO_INCLUDE_FOR_SEARCH = {
  $or: [
    {
      $or: [
        { "services_all.1.category": { $nin: DEFAULT_SERVICES_TO_EXCLUDE } },
        { "services_all.2": { $exists: true } },
      ],
      "services_all.1": { $exists: true },
    },
    { "services_all.0.category": { $nin: DEFAULT_SERVICES_TO_EXCLUDE } },
  ],
};

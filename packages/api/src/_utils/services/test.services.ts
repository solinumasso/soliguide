import { PlaceModel } from "../../place/models/place.model";
import { OrganizationModel } from "../../organization/models/organization.model";

import "../../place/models/photo.model";
import "../../place/models/document.model";
import "../../place/models/parcours.model";
import "../../user/models/invitation.model";
import "../../user/models/userRight.model";

export const getRequiredPlaceForTest = async (name: string) => {
  const populateQuery = [
    { model: "Photos", path: "photos" },
    {
      path: "services_all",
      populate: { model: "Docs", path: "modalities.docs" },
    },
    { model: "Docs", path: "modalities.docs" },
  ];

  if (name.includes("MARAUDE")) {
    populateQuery.push({
      path: "parcours",
      populate: { model: "Photos", path: "photos" },
    });
  }

  return PlaceModel.findOne({ name }).populate(populateQuery).lean().exec();
};

export const getRequiredOrgaForTest = async (name: string) => {
  return OrganizationModel.findOne({ name })
    .populate([
      "users",
      "places",
      {
        path: "invitations",
        populate: { model: "User", path: "user" },
      },
      {
        path: "invitations",
        populate: { model: "Organization", path: "organization" },
      },
    ])
    .lean()
    .exec();
};

export const FIELDS_FOR_SEARCH: {
  [key: string]: string;
} = {
  API: "close createdAt description distance entity lieu_id modalities name newhours position.address position.additionalInformation position.city position.cityCode position.postalCode position.department position.departmentCode position.regionCode position.country position.timeZone position.adresse position.codePostal position.complementAdresse position.departement position.location position.pays position.region position.ville publics seo_url services_all status sources tempInfos updatedAt visibility country",
  EXPORT_PLACE: "-geoZones -parcours -photos -stepsDone",
  MANAGE_PARCOURS:
    "-geoZones -modalities -newhours -photos -position -publics -services_all -stepsDone",
  MANAGE_PLACE:
    "-geoZones -modalities -newhours -parcours -photos -publics -services_all -stepsDone",
  ADD_PLACE_TO_ORGA:
    "-geoZones -modalities -newhours -photos -publics -services_all -stepsDone",
  ITINERARY_PUBLIC_SEARCH:
    "-geoZones -position -priority -slugs -stepsDone -verified -services_all.modalities.docs -modalities.docs -photos",
  PLACE_PUBLIC_SEARCH:
    "-geoZones -parcours -priority -slugs -stepsDone -verified -services_all.modalities.docs -modalities.docs -photos",
  DEFAULT: "lieu_id name",
  DEFAULT_CAMPAIGN: "lieu_id name campaigns",
};


export enum GeoTypes {
  BOROUGH = "codePostal", // Only used for the boroughs of Paris, Lyon and Marseille
  CITY = "ville",
  COUNTRY = "pays",
  DEPARTMENT = "departement",
  POSITION = "position",
  REGION = "region",
  CITIES_GROUP = "citiesGroup", // In France: EPCI, Communauté de communes, etc
  UNKNOWN = "inconnu",
}

export interface DocExportRow {
  rowId?: number | string; // Incremental number displayed in the document
  sectionName?: string; // Only for Word & PDF export, it's the name of the section
  lieu_id: number | string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  email?: string;
  phoneNumbers?: string;
  hours?: string;
  modalities?: string;
  publics?: string;
  linkToSoliguide?: string;
  tempClosure?: string;
  tempHours?: string;
  tempMessage?: string;
  services?: string; // Only one if we need to export services line by line
  category?: number | string; // Useful only for sorting by service
  updatedAt: string;
  latitude: string;
  longitude: string;
}

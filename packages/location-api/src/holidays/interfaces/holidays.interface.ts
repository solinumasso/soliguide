export interface HolidayLanguage {
  language: string;
  text: string;
}

export interface Holiday {
  id: string;
  startDate: string;
  endDate: string;
  type: "Public" | "School" | "National" | "Regional" | "Local";
  name: HolidayLanguage[];
  nationwide: boolean;
  subdivisions?: Array<{
    code: string;
    shortName: string;
  }>;
}

export interface TerritorySubdivision {
  code: string;
  isoCode: string;
  shortName: string;
  category: HolidayLanguage[];
  name: HolidayLanguage[];
  officialLanguages: string[];
  children?: TerritorySubdivision[];
}

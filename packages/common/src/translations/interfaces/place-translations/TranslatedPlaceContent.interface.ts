export interface TranslatedPlaceContent {
  place: {
    description: string | null;
    modalities: {
      appointment: { precisions: string | null };
      inscription: { precisions: string | null };
      orientation: { precisions: string | null };
      other: string | null;
      price: { precisions: string | null };
    };
    publics: {
      description: string | null;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    services_all: any[];
    tempInfos: {
      closure: {
        description: string | null;
      };
      hours: {
        description: string | null;
      };
      message: {
        description: string | null;
        name: string | null;
      };
    };
  };
  translationRate: number;
}

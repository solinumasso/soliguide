import { TranslatedPlaceContent } from "@soliguide/common";

export class ApiTranslatedPlaceContent implements TranslatedPlaceContent {
  public place: {
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
    services_all: [];
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

  public translationRate: number;

  constructor(data?: Partial<ApiTranslatedPlaceContent>) {
    this.translationRate = data?.translationRate ?? 0;
    this.place = data?.place ?? {
      description: null,
      modalities: {
        appointment: { precisions: null },
        inscription: { precisions: null },
        orientation: { precisions: null },
        other: null,
        price: { precisions: null },
      },
      publics: {
        description: null,
      },
      services_all: [],
      tempInfos: {
        closure: {
          description: null,
        },
        hours: {
          description: null,
        },
        message: {
          description: null,
          name: null,
        },
      },
    };
  }
}

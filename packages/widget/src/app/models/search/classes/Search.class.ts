
import {
  Categories,
  GeoPosition,
  SearchModalities,
  SearchPublics,
  SupportedLanguagesCode,
  WidgetId,
} from "@soliguide/common";

export class Search {
  public category?: Categories;
  public categories?: Categories[];
  public word?: string;

  public widgetId: WidgetId;

  public location: GeoPosition;
  public locations: Partial<GeoPosition>[];

  public modalities?: SearchModalities;
  public publics?: SearchPublics;

  public options: {
    limit?: number;
    page?: number;
  };

  public lang: SupportedLanguagesCode;

  constructor(data?: Partial<Search>) {
    if (data?.category) {
      this.category = data.category;
    } else if (data?.categories?.length) {
      this.categories = data.categories;
    } else {
      this.word = data?.word;
    }

    this.widgetId = data?.widgetId ?? WidgetId.SOLINUM;
    this.location = data?.location ?? new GeoPosition({});
    this.locations = data?.locations ?? [];
    this.lang = data?.lang ?? SupportedLanguagesCode.FR;
    this.modalities = data?.modalities;
    this.publics = data?.publics;

    this.options = data?.options ?? {
      limit: 10,
      page: 1,
    };
  }
}

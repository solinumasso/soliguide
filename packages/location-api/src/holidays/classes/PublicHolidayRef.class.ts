import { ApiProperty } from "@nestjs/swagger";
import { PublicHoliday, SupportedLanguagesCode } from "@soliguide/common";

export class PublicHolidayRef implements PublicHoliday {
  @ApiProperty({
    description: "Indicates if the holiday is national or regional",
    example: true,
  })
  isNational: boolean;

  @ApiProperty({
    description: "Name of the holiday in default language",
    example: "Jour de l'An",
  })
  name: string;

  @ApiProperty({
    description: "List of department codes where this holiday is observed",
    example: ["75", "92", "93", "94"],
    type: [String],
  })
  departments: string[];

  @ApiProperty({
    description: "Start date of the holiday in ISO format",
    example: "2024-01-01",
  })
  startDate: string;

  @ApiProperty({
    description: "End date of the holiday in ISO format",
    example: "2024-01-01",
  })
  endDate: string;

  @ApiProperty({
    description: "Holiday name translations in different languages",
    example: {
      en: "New Year's Day",
      fr: "Jour de l'An",
      es: "Año Nuevo",
    },
  })
  translations: {
    [key in SupportedLanguagesCode]?: string;
  };
}

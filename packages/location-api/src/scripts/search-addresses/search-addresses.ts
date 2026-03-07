import { HereApiService } from "../../location/services/here-api/here-api.service";
import { Logger } from "@nestjs/common";
import { bootstrapApplication } from "../../app-bootstrap";

// 1. Update this list with your addresses
const ADDRESSES_SEARCHED = ["Kirke 450, Depto 307, Canal Beagle, Viña del Mar"];

// 2. Update this country with located Country
const COUNTRY_SEARCHED = "CL";

// 3. Update this language with searched language
const LANG_SEARCHED = "ES";

async function bootstrap() {
  const app = await bootstrapApplication();
  const hereApiService = app.get(HereApiService);
  const logger = new Logger("SearchAddressesScript");

  const resultTable: {
    "❔❓Original address": string;
    address: string;
    city: string;
    postalCode: string;
  }[] = [];

  for (const address of ADDRESSES_SEARCHED) {
    try {
      const result = await hereApiService.findAddressForNewCountry({
        address,
        country: COUNTRY_SEARCHED,
        lang: LANG_SEARCHED,
      });

      resultTable.push({
        "❔❓Original address": address,
        address: result?.label ?? "🔴 Not found",
        city: result?.city ?? "🔴 Not found",
        postalCode: result?.postalCode ?? "🔴 Not found",
      });
    } catch (error) {
      logger.error(`Error for ${address}:`, error);
    }
  }
  console.table(resultTable);
  await app.close();
}

bootstrap();

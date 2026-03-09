import { Logger } from "@nestjs/common";
import { bootstrapApplication } from "../app-bootstrap";
import { GenerateHolidaysService } from "../holidays/services/generate-holidays.service";

async function bootstrap() {
  const app = await bootstrapApplication();
  const generateHolidaysService = app.get(GenerateHolidaysService);
  const logger = new Logger("GenerateHolidaysScript");

  try {
    await generateHolidaysService.createHolidaysFile();
    logger.log("Generation of holidays OK");
  } catch (error) {
    logger.error(`Error for holidays `, error);
  }

  await app.close();
}

bootstrap();

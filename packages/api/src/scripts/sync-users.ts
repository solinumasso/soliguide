import "../instrument";

import mongoose from "mongoose";

import { CountryCodes, Themes, UserStatus } from "@soliguide/common";

import { connectToDatabase } from "../config/database/connection";
import { logger } from "../general/logger";
import { UserModel } from "../user/models/user.model";
import { DEFAULT_USER_POPULATE } from "../user/constants";
import { getUserRightsWithParams } from "../user/services/userRights.service";
import {
  AmqpSynchroAirtableUserEvent,
  amqpEventsSender,
  Exchange,
  RoutingKey,
} from "../events";
import type { UserPopulateType } from "../_models";

const COUNTRY_TO_THEME: Record<string, Themes> = {
  [CountryCodes.FR]: Themes.SOLIGUIDE_FR,
  [CountryCodes.ES]: Themes.SOLIGUIA_ES,
  [CountryCodes.AD]: Themes.SOLIGUIA_AD,
};

const BATCH_SIZE = 5000;
const THROTTLE_BATCH_SIZE = 50;
const THROTTLE_DELAY_MS = 1000;

const PROD_FRONT_URLS: Record<Themes, string> = {
  [Themes.SOLIGUIDE_FR]: "https://soliguide.fr",
  [Themes.SOLIGUIA_ES]: "https://soliguia.cat",
  [Themes.SOLIGUIA_AD]: "https://soliguia.ad",
};

function getThemeAndUrlFromUser(user: UserPopulateType): {
  theme: Themes;
  frontendUrl: string;
} {
  const firstCountry = user.areas ? Object.keys(user.areas)[0] : null;
  const theme =
    (firstCountry && COUNTRY_TO_THEME[firstCountry]) || Themes.SOLIGUIDE_FR;
  const frontendUrl = PROD_FRONT_URLS[theme]; // ← prod URL au lieu de FRONT_URLS_MAPPINGS
  return { theme, frontendUrl };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run(): Promise<void> {
  await connectToDatabase();

  logger.info("SCRIPT - SYNC PRO AND ADMIN_TERRITORY USERS TO AIRTABLE\tSTART");

  let lastId: string | null = null;
  let totalSent = 0;
  let throttleCpt = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const paginatedFilter: Record<string, any> = {
      status: { $in: [UserStatus.PRO, UserStatus.ADMIN_TERRITORY] },
      ...(lastId ? { _id: { $gt: lastId } } : {}),
    };

    const users = await UserModel.find(paginatedFilter)
      .populate(DEFAULT_USER_POPULATE)
      .sort({ _id: 1 })
      .limit(BATCH_SIZE)
      .lean<UserPopulateType[]>()
      .exec();

    if (users.length === 0) {
      break;
    }

    lastId = users[users.length - 1]._id.toString();

    for (const user of users) {
      if (!user.userRights?.length) {
        user.userRights = await getUserRightsWithParams({ user: user._id });
      }

      const { theme, frontendUrl } = getThemeAndUrlFromUser(user);

      const payload = new AmqpSynchroAirtableUserEvent(
        user,
        frontendUrl,
        theme
      );

      await amqpEventsSender.sendToQueue(
        Exchange.SYNCHRO_AT,
        `${RoutingKey.SYNCHRO_AT}.user`,
        payload
      );

      totalSent++;
      throttleCpt++;

      if (throttleCpt >= THROTTLE_BATCH_SIZE) {
        await sleep(THROTTLE_DELAY_MS);
        throttleCpt = 0;
      }
    }

    logger.info(`SYNC AIRTABLE USERS - ${totalSent} users sent so far`);
  }

  logger.info(
    `SCRIPT - SYNC PRO AND ADMIN_TERRITORY USERS TO AIRTABLE\tEND - ${totalSent} users sent`
  );

  await mongoose.connection.close();
}

run().catch((err) => {
  logger.error(err, "SYNC AIRTABLE USERS - Fatal error");
  process.exit(1);
});

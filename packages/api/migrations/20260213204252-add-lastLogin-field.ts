import { Db } from "mongodb";

import { logger } from "../src/general/logger";

const message = "Add lastLogin field to users and organizations collections";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  // Add lastLogin field to users collection
  const usersCollection = db.collection("users");
  const usersCountBefore = await usersCollection.countDocuments({
    lastLogin: { $exists: false },
  });
  logger.info(
    `[MIGRATION] - Found ${usersCountBefore} users without lastLogin field`
  );

  const usersResult = await usersCollection.updateMany(
    { lastLogin: { $exists: false } },
    { $set: { lastLogin: null } }
  );
  logger.info(
    `[MIGRATION] - Added lastLogin field to ${usersResult.modifiedCount} users`
  );

  // Add lastLogin field to organization collection
  const organizationCollection = db.collection("organization");
  const orgsCountBefore = await organizationCollection.countDocuments({
    lastLogin: { $exists: false },
  });
  logger.info(
    `[MIGRATION] - Found ${orgsCountBefore} organizations without lastLogin field`
  );

  const orgsResult = await organizationCollection.updateMany(
    { lastLogin: { $exists: false } },
    { $set: { lastLogin: null } }
  );
  logger.info(
    `[MIGRATION] - Added lastLogin field to ${orgsResult.modifiedCount} organizations`
  );

  // Verify the migration
  const usersCountAfter = await usersCollection.countDocuments({
    lastLogin: { $exists: false },
  });
  const orgsCountAfter = await organizationCollection.countDocuments({
    lastLogin: { $exists: false },
  });
  logger.info(
    `[MIGRATION] - Remaining users without lastLogin: ${usersCountAfter}`
  );
  logger.info(
    `[MIGRATION] - Remaining organizations without lastLogin: ${orgsCountAfter}`
  );
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  // Remove lastLogin field from users collection
  const usersCollection = db.collection("users");
  const usersResult = await usersCollection.updateMany(
    {},
    { $unset: { lastLogin: "" } }
  );
  logger.info(
    `[ROLLBACK] - Removed lastLogin field from ${usersResult.modifiedCount} users`
  );

  // Remove lastLogin field from organization collection
  const organizationCollection = db.collection("organization");
  const orgsResult = await organizationCollection.updateMany(
    {},
    { $unset: { lastLogin: "" } }
  );
  logger.info(
    `[ROLLBACK] - Removed lastLogin field from ${orgsResult.modifiedCount} organizations`
  );
};

import { CONFIG } from "./src/_models";

const config = {
  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: "changelog",

  // The file extension to create migrations and search for in migration dir.
  migrationFileExtension: `.${__filename.split(".").pop()}`,

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: "migrations",

  // Don't change this, unless you know what you're doing.
  moduleSystem: "commonjs",

  mongodb: {
    options: {
      directConnection: CONFIG.ENV !== "preprod" && CONFIG.ENV !== "prod", // allows connecting to a replica set on local database
    },
    url: CONFIG.MONGODB_URI,
  },

  // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determine
  // if the file should be run. Requires that scripts are coded to be run multiple times.
  useFileHash: false,
};

module.exports = config;

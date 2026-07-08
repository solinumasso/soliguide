/**
 * Stable identifier of a cron execution stored in the `cronLogs` collection.
 */
export enum CronLogName {
  SET_CURRENT_TEMP_INFO = "SET_CURRENT_TEMP_INFO",
  SET_OFFLINE = "SET_OFFLINE",
  SET_IS_OPEN_TODAY = "SET_IS_OPEN_TODAY",
  SYNC_PLACES_TO_AIRTABLE = "SYNC_PLACES_TO_AIRTABLE",
  TRANSLATE_FIELDS = "TRANSLATE_FIELDS",
  UNSET_OBSOLETE_TEMP_INFO = "UNSET_OBSOLETE_TEMP_INFO",
}

/**
 * Lifecycle status of a single cron execution stored in the `cronLogs` collection.
 */
export enum CronLogStatus {
  RUNNING = "RUNNING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

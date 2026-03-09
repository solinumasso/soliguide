export const FR_TIMEZONES = [
  "America/Martinique",
  "America/Cayenne",
  "Indian/Reunion",
  "Indian/Mayotte",
  "Europe/Paris",
  "Pacific/Noumea",
  "Pacific/Tahiti",
  "Pacific/Wallis",
  "America/Miquelon",
  "Indian/Maldives",
] as const;

export const ES_TIMEZONES = [
  "Africa/Ceuta", // UTC +01:00
  "Atlantic/Canary", // UTC
  "Europe/Madrid", // UTC +01:00
] as const;

export const AD_TIMEZONES = ["Europe/Andorra"] as const;

export const ALL_TIMEZONES = [
  ...FR_TIMEZONES,
  ...ES_TIMEZONES,
  ...AD_TIMEZONES,
] as const;

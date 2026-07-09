import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

const SOLINUM_HOSTNAME = "solinum.org";

export function buildPublicApiCorsOptions(): CorsOptions {
  const env = process.env.ENV ?? "dev";

  return {
    allowedHeaders: [
      "authorization",
      "content-type",
      "x-api-version",
      "x-document-referrer",
    ],
    methods: ["POST", "OPTIONS"],
    optionsSuccessStatus: 204,
    origin: (requestOrigin, callback) => {
      callback(null, isPublicApiCorsOriginAllowed(requestOrigin, env));
    },
  };
}

export function isPublicApiCorsOriginAllowed(
  requestOrigin: string | undefined,
  env = process.env.ENV ?? "dev"
): boolean {
  if (!requestOrigin || env === "dev" || env === "test") {
    return true;
  }

  const requestHostname = extractHostname(requestOrigin);
  if (!requestHostname) {
    return false;
  }

  return allowedHostnames().includes(requestHostname);
}

function allowedHostnames(): string[] {
  return [
    SOLINUM_HOSTNAME,
    process.env.SOLIGUIA_AD_URL ?? "http://localhost:4220",
    process.env.SOLIGUIA_ES_URL ?? "http://localhost:4210",
    process.env.SOLIGUIDE_FR_URL ?? "http://localhost:4200",
    process.env.WEBAPP_FR_URL ?? "http://localhost:5173",
    process.env.WEBAPP_ES_URL ?? "http://localhost:5173",
    process.env.WEBAPP_AD_URL ?? "http://localhost:5173",
    process.env.WIDGET_URL ?? "http://localhost:4201",
  ]
    .map((url) => extractHostname(url))
    .filter(Boolean);
}

function extractHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

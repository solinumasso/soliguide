
import { ExpressRequest } from "../../../_models";

export const handleReferer = (req: ExpressRequest): string | null => {
  // Header passed by the widget giving up the iframe parent page (cf. https://developer.mozilla.org/en-US/docs/Web/API/Document/referrer)
  const documentReferrer = req.get("x-document-referrer");
  if (typeof documentReferrer !== "undefined") {
    return documentReferrer;
  }
  // cf. https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer
  return req.get("referer") || null;
};

export const cleanUrl = (url?: string): string => {
  if (!url) {
    return "";
  }

  let cleanedUrl = url.trim();

  cleanedUrl = cleanedUrl.replace(/^https?:\/\/(https?:\/\/)/, "$1");

  if (cleanedUrl.startsWith("http://")) {
    cleanedUrl = cleanedUrl.replace("http://", "https://");
  } else if (!cleanedUrl.startsWith("https://")) {
    cleanedUrl = `https://${cleanedUrl}`;
  }

  return cleanedUrl
    .replace(/\/+$/, "")
    .replace(/(https:\/\/)\/+/g, "$1")
    .replace(/\s+/g, "");
};

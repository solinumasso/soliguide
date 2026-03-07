
/**
 * Check if a route is public (accessible by bots without origin validation)
 * Public routes: medias, sitemap, robots.txt, health
 */
export const isPublicRoute = (path?: string): boolean => {
  if (!path) {
    return false;
  }
  return (
    path.startsWith("/medias/") ||
    path.startsWith("/sitemap") ||
    path === "/robots.txt" ||
    path === "/health"
  );
};

export const getCorsDomains = (domains: string): RegExp[] => {
  return domains
    .split(",")
    .map((domain) => domain.trim())
    .map((domain) => new RegExp(`\\.${domain.replace(/\./g, "\\.")}$`));
};

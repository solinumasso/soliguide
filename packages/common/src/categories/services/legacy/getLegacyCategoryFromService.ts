// [CATEGORY] File to remove after complete switch
export const getLegacyCategoryFromService = (service: number): number => {
  return Math.floor(service / 100) * 100;
};

export const AXIOS_CONFIG = {
  timeout: 5000,
  retries: 2,
  retryDelay: (retryCount: number) => retryCount * 1000,
};

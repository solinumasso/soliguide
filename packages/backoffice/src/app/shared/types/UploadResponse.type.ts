export type UploadResponse = {
  success?: boolean;
  status?: string;
  message?: number;
  filePath?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
};

export type ExtractedChange = {
  changeClassName: string;
  payloadPath: string;
  remove: string[];
  set: Map<string, string>;
  replace?: string;
};

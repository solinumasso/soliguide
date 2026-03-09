export type ExpressValidatorError = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  msg: string;
  path: string;
  location: string;
};

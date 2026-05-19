import { ExpressValidatorError } from "../../../shared/types/ExpressValidatorError.type";

export class ApiError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ApiError.prototype);

    this.error = [];
    this.status = 0;
  }

  public status: number;

  public error: ExpressValidatorError[];
}

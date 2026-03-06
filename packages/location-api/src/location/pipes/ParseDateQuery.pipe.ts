import { Injectable, PipeTransform, BadRequestException } from "@nestjs/common";
import { isValid, parse, format as formatDate, isMatch } from "date-fns";

@Injectable()
export class ParseDateQueryPipe implements PipeTransform<string, Date> {
  private readonly validFormats = ["yyyy-MM-dd", "dd/MM/yyyy"];

  constructor(private readonly format: string) {
    this.validateFormat();
  }

  private validateFormat(): void {
    if (!this.format) {
      throw new Error("Format parameter is required");
    }

    if (!this.validFormats.includes(this.format)) {
      throw new Error(
        `Invalid format pattern. Valid formats are: ${this.validFormats.join(
          ", "
        )}`
      );
    }
  }

  private isValidDateString(value: string): boolean {
    try {
      return isMatch(value, this.format);
    } catch {
      return false;
    }
  }

  transform(value: string): Date {
    if (!value) {
      throw new BadRequestException("Date string is required");
    }

    if (!this.isValidDateString(value)) {
      throw new BadRequestException(
        `Invalid date format. Expected format: ${this.format}. ` +
          `Example: ${formatDate(new Date(), this.format)}`
      );
    }

    try {
      const parsedDate = parse(value, this.format, new Date());

      if (!isValid(parsedDate)) {
        throw new BadRequestException(
          `Invalid date value. Please provide a valid date in format: ${this.format}`
        );
      }

      const year = parsedDate.getFullYear();
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      if (year < currentYear || year > nextYear) {
        throw new BadRequestException(
          `Date year must be between ${currentYear} and ${nextYear}`
        );
      }

      return parsedDate;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error parsing date: ${error.toString()}`);
    }
  }
}

import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from "@nestjs/common";
import { z, ZodType } from "zod";

export class ZodValidationPipe<TSchema extends ZodType>
  implements PipeTransform
{
  constructor(
    private readonly schema: TSchema,
    private readonly errorMessage = "Validation failed"
  ) {}

  transform(value: unknown, _metadata: ArgumentMetadata): z.infer<TSchema> {
    const parsed = this.schema.safeParse(value);

    if (parsed.success) {
      return parsed.data;
    }

    const flattened = z.flattenError(parsed.error);
    const payload: ZodValidationErrorPayload = {
      message: this.errorMessage,
      details: {
        fieldErrors: flattened.fieldErrors,
        formErrors: flattened.formErrors,
        issues: parsed.error.issues.map((issue) => ({
          code: issue.code,
          message: issue.message,
          path: issue.path.length === 0 ? "root" : issue.path.join("."),
        })),
      },
    };

    throw new BadRequestException(payload);
  }
}

type ZodValidationIssue = {
  code: string;
  message: string;
  path: string;
};

type ZodValidationErrorPayload = {
  message: string;
  details: {
    fieldErrors: Record<string, string[] | undefined>;
    formErrors: string[];
    issues: ZodValidationIssue[];
  };
};

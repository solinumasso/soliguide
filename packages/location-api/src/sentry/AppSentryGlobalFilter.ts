import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { captureException, SentryExceptionCaptured } from "@sentry/nestjs";
import { FastifyReply, FastifyRequest } from "fastify";

@Catch()
export class AppSentryGlobalFilter implements ExceptionFilter {
  @SentryExceptionCaptured()
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const response = ctx.getResponse<FastifyReply>();

    const originClass =
      exception["stack"]?.split("\n")[1]?.match(/at (\w+)\./)?.[1] || "Unknown";

    const logger = new Logger(originClass);

    logger.error(
      `Error in ${originClass}: ${exception?.message}`,
      exception?.stack
    );

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status !== HttpStatus.OK || !(exception instanceof HttpException)) {
      captureException(exception, {
        extra: {
          url: request?.routeOptions?.url,
          method: request.method,
          params: request.params,
          query: request.query,
          body: request.body,
          statusCode: status,
          originClass,
        },
      });
    }

    response.status(status).send({
      statusCode: status,
      message: exception?.message || "Internal server error",
    });
  }
}

/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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

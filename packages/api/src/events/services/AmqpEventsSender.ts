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
import axios, { AxiosInstance, AxiosResponse } from "axios";
import type { Logger } from "pino";
import { logger } from "../../general/logger";
import { CONFIG } from "../../_models/config";

import { Exchange } from "../enums";
import { AmqpEvent } from "../interfaces";

export class AmqpEventsSender {
  private http?: AxiosInstance;

  constructor() {
    this.connect();
  }

  private async buildHttpClient(): Promise<AxiosInstance | null> {
    const base = process.env.RABBIT_HTTP_BASE;
    const user = process.env.RABBIT_USER;
    const pass = process.env.RABBIT_PASSWORD;

    try {
      if (!base || !user || !pass) {
        logger.warn(
          "HTTP RabbitMQ not configured (RABBIT_HTTP_BASE / RABBIT_USER / RABBIT_PASSWORD)."
        );
        return null;
      }

      const http = axios.create({
        baseURL: base,
        auth: { username: user, password: pass },
        headers: { "content-type": "application/json" },
        timeout: 15000,
      });

      logger.info("Connecting to AMQP broker...");
      logger.info("Connection to AMQP broker established");

      return http;
    } catch (err) {
      logger.error({ err }, "Failed to initialize RabbitMQ HTTP client");
      return null;
    }
  }

  private async connect() {
    const client = await this.buildHttpClient();
    this.http = client ?? undefined;
  }

  public async close(): Promise<void> {
    if (this.http) {
      logger.info("Closing AMQP Connection...");
      this.http = undefined;
      logger.info("AMQP Connection successfully closed");
    }
  }

  private async publish(
    exchangeName: string,
    routingKey: string,
    body: string,
    log: Logger
  ): Promise<AxiosResponse | null> {
    try {
      const res = await this.http!.post(
        `/exchanges/%2F/${encodeURIComponent(exchangeName)}/publish`,
        {
          properties: { content_type: "application/json", delivery_mode: 2 },
          routing_key: routingKey,
          payload: body,
          payload_encoding: "string",
          mandatory: true,
        }
      );

      if (res.data?.routed) return res;

      log.warn(
        `Message not routed (exchange='${exchangeName}', routingKey='${routingKey}')`
      );
      return null;
    } catch (err) {
      log.error(
        { err },
        `Publish failed (exchange='${exchangeName}', routingKey='${routingKey}')`
      );
      return null;
    }
  }

  public async sendToQueue<T extends AmqpEvent>(
    exchange: Exchange,
    routingKey: string,
    payload: T,
    log: Logger = logger
  ): Promise<void> {
    if (CONFIG.ENV === "test" || !this.http) return;

    const exchangeName = exchange as string;
    const body =
      typeof payload === "string" ? payload : JSON.stringify(payload);

    while (!(await this.publish(exchangeName, routingKey, body, log))) {
      // Keep retrying indefinitely until success
    }
  }
}
// TEST
export const amqpEventsSender = new AmqpEventsSender();

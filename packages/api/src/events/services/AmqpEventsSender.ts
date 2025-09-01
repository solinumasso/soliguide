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
import axios, { AxiosInstance } from "axios";
import type { Logger } from "pino";
import { logger } from "../../general/logger";
import { CONFIG } from "../../_models/config";

import { Exchange } from "../enums";
import { AmqpEvent } from "../interfaces";

export class AmqpEventsSender {
  private http?: AxiosInstance;
  private vhostEnc = "%2F";

  constructor() {
    this.connect();
  }

  private async connect() {
    if (!CONFIG.AMQP_URL) {
      logger.warn("AMQP_URL undefined, HTTP RabbitMQ not configured.");
      return;
    }

    const parsed = new URL(CONFIG.AMQP_URL);
    const base = `${parsed.protocol}//${parsed.hostname}${
      parsed.port ? `:${parsed.port}` : ""
    }${parsed.pathname}`;
    const user = decodeURIComponent(parsed.username);
    const pass = decodeURIComponent(parsed.password);
    const vhost = "/";

    this.vhostEnc = encodeURIComponent(vhost);
    this.http = axios.create({
      baseURL: base.replace(/\/+$/, ""),
      auth: { username: user, password: pass },
      headers: { "content-type": "application/json" },
      timeout: 15000,
    });

    logger.info("Connecting to AMQP broker...");
    await Promise.all(
      Object.values(Exchange).map((exchange) =>
        this.http!.put(
          `/exchanges/${this.vhostEnc}/${encodeURIComponent(exchange)}`,
          {
            type: "topic",
            durable: true,
            auto_delete: false,
            internal: false,
            arguments: {},
          }
        )
      )
    );
    logger.info("Connection to AMQP broker established");
  }

  public async close(): Promise<void> {
    if (this.http) {
      logger.info("Closing AMQP Connection...");
      this.http = undefined;
      logger.info("AMQP Connection successfully closed");
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

    let retries = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const { data } = await this.http.post(
          `/exchanges/${this.vhostEnc}/${encodeURIComponent(
            exchangeName
          )}/publish`,
          {
            properties: {
              content_type: "application/json",
              delivery_mode: 2,
            },
            routing_key: routingKey,
            payload: body,
            payload_encoding: "string",
            mandatory: true,
          }
        );

        if (data?.routed) {
          log.info("AMQP event sent successfully");
          return;
        }

        throw new Error(
          `Message not routed (exchange='${exchangeName}', routingKey='${routingKey}')`
        );
      } catch (err) {
        if (retries >= 3) {
          log.error(
            `AMQP 3 tests, sending failed:\n Exchange\t${exchangeName}\nroutingKey\t${routingKey}`
          );
          throw new Error("FAILED_PUBLISH_EVENT");
        }
        retries++;
        await new Promise((r) => setTimeout(r, 100));
      }
    }
  }
}

export const amqpEventsSender = new AmqpEventsSender();

import amqp, {
  AmqpConnectionManager,
  ChannelWrapper,
} from "amqp-connection-manager";
import { ConfirmChannel } from "amqplib";
import type { Logger } from "pino";

import { logger } from "../../general/logger";
import { CONFIG } from "../../_models/config";

import { Exchange } from "../enums";
import { AmqpEvent } from "../interfaces";

export class AmqpEventsSender {
  private connectionManager?: AmqpConnectionManager;
  private channelWrapper?: ChannelWrapper;

  constructor() {
    this.connect();
  }

  private connect() {
    if (CONFIG.AMQP_URL) {
      logger.info("Connecting to AMQP broker...");
      this.connectionManager = amqp.connect(CONFIG.AMQP_URL);
      this.channelWrapper = this.connectionManager?.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel) =>
          await Promise.all(
            // Create all exchanges if they do not exist
            Object.values(Exchange).map((exchange) =>
              channel.assertExchange(exchange, "topic", {
                durable: true,
              })
            )
          ),
      });
      logger.info("Connection to AMQP broker established");
    }
  }

  public async close(): Promise<void> {
    if (this.connectionManager) {
      logger.info("Closing AMQP Connection...");
      await this.channelWrapper?.close();
      delete this.channelWrapper;
      await this.connectionManager.close();
      delete this.connectionManager;
      logger.info("AMQP Connection successfully closed");
    }
  }

  public async sendToQueue<T extends AmqpEvent>(
    exchange: Exchange,
    routingKey: string,
    payload: T,
    log: Logger = logger
  ): Promise<void> {
    if (CONFIG.ENV === "test" || !CONFIG.AMQP_URL) {
      return;
    }

    if (this.channelWrapper) {
      let retries = 0;

      while (
        !(await this.channelWrapper.publish(exchange, routingKey, payload))
      ) {
        if (retries === 3) {
          log.error(
            `AMQP 3 tests, sending failed:\n Exchange\t${exchange}\nroutingKey\t${routingKey}`
          );
          throw new Error("FAILED_PUBLISH_EVENT");
        }
        retries++;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      log.info("AMQP event sent successfully");
    } else {
      log.warn("AmqpEventSender not configured");
    }
  }
}

export const amqpEventsSender = new AmqpEventsSender();

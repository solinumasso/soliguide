import type { Logger } from "pino";
import { Subject } from "rxjs";
import { debounceTime, groupBy, last, mergeMap } from "rxjs/operators";

import { Exchange, RoutingKey } from "../enums";
import type { AmqpSynchroAirtablePlaceEvent } from "../classes";
import { amqpEventsSender, type AmqpEventsSender } from "./AmqpEventsSender";

const DEBOUNCE_DELAY_MS = 60_000;

/**
 * Routing keys the debounced place event is published to. The same payload
 * feeds both CRMs through n8n, which binds one queue per key on the
 * `soliguide.places` topic exchange.
 */
const PLACE_SYNCHRO_ROUTING_KEYS = [
  `${RoutingKey.PLACES}.synchro_at`,
  `${RoutingKey.PLACES}.synchro_brevo`,
] as const;

interface QueuedSynchroAtEvent {
  lieu_id: number;
  payload: AmqpSynchroAirtablePlaceEvent;
  log: Logger;
}

/**
 * Debounces place synchro events (Airtable + Brevo) per lieu_id before sending
 * them to RabbitMQ.
 *
 * The campaign form submits several sections in quick succession, producing
 * a burst of events (STARTED, STARTED, STARTED, FINISHED) for the same place.
 * Since the downstream consumer (n8n) may process messages concurrently, an
 * earlier STARTED could overwrite the final FINISHED in Airtable.
 *
 * By debouncing per lieu_id, only the last event of a burst is published.
 */
export class AmqpSynchroAtDebounceQueue {
  private readonly events$ = new Subject<QueuedSynchroAtEvent>();

  constructor(
    private readonly sender: Pick<AmqpEventsSender, "sendToQueue">,
    debounceMs: number = DEBOUNCE_DELAY_MS
  ) {
    this.events$
      .pipe(
        // Partition the stream by lieu_id so each place is debounced on its own
        groupBy((event) => event.lieu_id, {
          // Complete (and free) a group once it stays silent for debounceMs
          duration: (group$) => group$.pipe(debounceTime(debounceMs)),
        }),
        // Keep only the last event received in each group before it completed
        mergeMap((group$) => group$.pipe(last()))
      )
      .subscribe((event) => this.send(event));
  }

  enqueue(
    lieu_id: number,
    payload: AmqpSynchroAirtablePlaceEvent,
    log: Logger
  ): void {
    this.events$.next({ lieu_id, payload, log });
  }

  private send({ payload, log }: QueuedSynchroAtEvent): void {
    // Publish to each destination independently: a failure on one CRM must not
    // prevent the event from reaching the other.
    void Promise.allSettled(
      PLACE_SYNCHRO_ROUTING_KEYS.map((routingKey) =>
        this.sender.sendToQueue(Exchange.PLACES, routingKey, payload, log)
      )
    ).then((publishResults) =>
      publishResults.forEach((result, index) => {
        if (result.status === "rejected") {
          log.error(
            result.reason,
            `SYNCHRO_SEND_FAILED - ${PLACE_SYNCHRO_ROUTING_KEYS[index]}`
          );
        }
      })
    );
  }
}

export const synchroAtDebounceQueue = new AmqpSynchroAtDebounceQueue(
  amqpEventsSender
);

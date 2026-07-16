import { AmqpSynchroAtDebounceQueue } from "./AmqpSynchroAtDebounceQueue";
import { Exchange, RoutingKey } from "../enums";
import type { AmqpSynchroAirtablePlaceEvent } from "../classes";
import type { Logger } from "pino";

const DEBOUNCE_MS = 60_000;

const SYNCHRO_AT_KEY = `${RoutingKey.PLACES}.synchro_at`;
const SYNCHRO_BREVO_KEY = `${RoutingKey.PLACES}.synchro_brevo`;

const makePayload = (campaignStatus: string) =>
  ({ campaignStatus } as unknown as AmqpSynchroAirtablePlaceEvent);

const makeMocks = () => {
  const sendToQueue = jest.fn().mockResolvedValue(undefined);
  const log = { error: jest.fn() } as unknown as Logger;
  const queue = new AmqpSynchroAtDebounceQueue({ sendToQueue }, DEBOUNCE_MS);
  return { sendToQueue, log, queue };
};

describe("AmqpSynchroAtDebounceQueue", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("sends nothing before the debounce delay has elapsed", () => {
    const { sendToQueue, log, queue } = makeMocks();

    queue.enqueue(1, makePayload("STARTED"), log);

    jest.advanceTimersByTime(DEBOUNCE_MS - 1);

    expect(sendToQueue).not.toHaveBeenCalled();
  });

  it("publishes to both synchro_at and synchro_brevo after 1 minute of inactivity", () => {
    const { sendToQueue, log, queue } = makeMocks();
    const payload = makePayload("FINISHED");

    queue.enqueue(1, payload, log);

    jest.advanceTimersByTime(DEBOUNCE_MS);

    expect(sendToQueue).toHaveBeenCalledTimes(2);
    expect(sendToQueue).toHaveBeenCalledWith(
      Exchange.PLACES,
      SYNCHRO_AT_KEY,
      payload,
      log
    );
    expect(sendToQueue).toHaveBeenCalledWith(
      Exchange.PLACES,
      SYNCHRO_BREVO_KEY,
      payload,
      log
    );
  });

  it("sends only the last event when multiple events arrive for the same lieu_id", () => {
    const { sendToQueue, log, queue } = makeMocks();
    const finishedPayload = makePayload("FINISHED");

    queue.enqueue(1, makePayload("STARTED"), log);
    jest.advanceTimersByTime(900);
    queue.enqueue(1, makePayload("STARTED"), log);
    jest.advanceTimersByTime(1000);
    queue.enqueue(1, makePayload("STARTED"), log);
    jest.advanceTimersByTime(1200);
    queue.enqueue(1, finishedPayload, log);

    jest.advanceTimersByTime(DEBOUNCE_MS);

    expect(sendToQueue).toHaveBeenCalledTimes(2);
    expect(sendToQueue).toHaveBeenCalledWith(
      Exchange.PLACES,
      SYNCHRO_AT_KEY,
      finishedPayload,
      log
    );
    expect(sendToQueue).toHaveBeenCalledWith(
      Exchange.PLACES,
      SYNCHRO_BREVO_KEY,
      finishedPayload,
      log
    );
  });

  it("resets the timer when a new event arrives before the delay elapses", () => {
    const { sendToQueue, log, queue } = makeMocks();
    const finishedPayload = makePayload("FINISHED");

    queue.enqueue(1, makePayload("STARTED"), log);

    jest.advanceTimersByTime(30_000);
    expect(sendToQueue).not.toHaveBeenCalled();

    queue.enqueue(1, finishedPayload, log);

    jest.advanceTimersByTime(DEBOUNCE_MS - 1);
    expect(sendToQueue).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(sendToQueue).toHaveBeenCalledTimes(2);
    expect(sendToQueue).toHaveBeenCalledWith(
      Exchange.PLACES,
      SYNCHRO_AT_KEY,
      finishedPayload,
      log
    );
    expect(sendToQueue).toHaveBeenCalledWith(
      Exchange.PLACES,
      SYNCHRO_BREVO_KEY,
      finishedPayload,
      log
    );
  });

  it("handles different lieu_ids independently", () => {
    const { sendToQueue, log, queue } = makeMocks();
    const payload1 = makePayload("FINISHED");
    const payload2 = makePayload("STARTED");

    queue.enqueue(1, payload1, log);
    queue.enqueue(2, payload2, log);

    jest.advanceTimersByTime(DEBOUNCE_MS);

    // 2 lieu_ids × 2 routing keys
    expect(sendToQueue).toHaveBeenCalledTimes(4);
    expect(sendToQueue).toHaveBeenCalledWith(
      Exchange.PLACES,
      SYNCHRO_AT_KEY,
      payload1,
      log
    );
    expect(sendToQueue).toHaveBeenCalledWith(
      Exchange.PLACES,
      SYNCHRO_BREVO_KEY,
      payload1,
      log
    );
    expect(sendToQueue).toHaveBeenCalledWith(
      Exchange.PLACES,
      SYNCHRO_AT_KEY,
      payload2,
      log
    );
    expect(sendToQueue).toHaveBeenCalledWith(
      Exchange.PLACES,
      SYNCHRO_BREVO_KEY,
      payload2,
      log
    );
  });

  it("logs the error for the failing key without preventing the other publish", async () => {
    const { sendToQueue, log, queue } = makeMocks();
    const error = new Error("AMQP connection lost");
    // Only the first publish (synchro_at) fails; synchro_brevo still resolves.
    sendToQueue.mockRejectedValueOnce(error);

    queue.enqueue(1, makePayload("FINISHED"), log);

    // The async variant fires the debounce timer AND drains the microtasks of
    // the allSettled().then() chain, so the error handler has run by the time
    // we assert.
    await jest.advanceTimersByTimeAsync(DEBOUNCE_MS);

    expect(sendToQueue).toHaveBeenCalledTimes(2);
    expect(log.error).toHaveBeenCalledWith(
      error,
      `SYNCHRO_SEND_FAILED - ${SYNCHRO_AT_KEY}`
    );
    expect(log.error).toHaveBeenCalledTimes(1);
  });
});

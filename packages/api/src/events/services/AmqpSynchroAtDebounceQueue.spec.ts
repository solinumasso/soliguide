import { AmqpSynchroAtDebounceQueue } from "./AmqpSynchroAtDebounceQueue";
import { Exchange, RoutingKey } from "../enums";
import type { AmqpSynchroAirtablePlaceEvent } from "../classes";
import type { Logger } from "pino";

const DEBOUNCE_MS = 60_000;

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

  it("sends the event after 1 minute of inactivity", () => {
    const { sendToQueue, log, queue } = makeMocks();
    const payload = makePayload("FINISHED");

    queue.enqueue(1, payload, log);

    jest.advanceTimersByTime(DEBOUNCE_MS);

    expect(sendToQueue).toHaveBeenCalledTimes(1);
    expect(sendToQueue).toHaveBeenCalledWith(
      Exchange.PLACES,
      `${RoutingKey.PLACES}.synchro_at`,
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

    expect(sendToQueue).toHaveBeenCalledTimes(1);
    expect(sendToQueue).toHaveBeenCalledWith(
      Exchange.PLACES,
      `${RoutingKey.PLACES}.synchro_at`,
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
    expect(sendToQueue).toHaveBeenCalledTimes(1);
    expect(sendToQueue).toHaveBeenCalledWith(
      Exchange.PLACES,
      `${RoutingKey.PLACES}.synchro_at`,
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

    expect(sendToQueue).toHaveBeenCalledTimes(2);
    expect(sendToQueue).toHaveBeenCalledWith(
      Exchange.PLACES,
      `${RoutingKey.PLACES}.synchro_at`,
      payload1,
      log
    );
    expect(sendToQueue).toHaveBeenCalledWith(
      Exchange.PLACES,
      `${RoutingKey.PLACES}.synchro_at`,
      payload2,
      log
    );
  });

  it("logs the error and does not throw when sendToQueue rejects", async () => {
    const { sendToQueue, log, queue } = makeMocks();
    const error = new Error("AMQP connection lost");
    sendToQueue.mockRejectedValueOnce(error);

    queue.enqueue(1, makePayload("FINISHED"), log);

    jest.advanceTimersByTime(DEBOUNCE_MS);

    // Let the rejected promise settle through the .catch()
    await Promise.resolve();

    expect(log.error).toHaveBeenCalledWith(error, "SYNCHRO_AT_SEND_FAILED");
  });
});

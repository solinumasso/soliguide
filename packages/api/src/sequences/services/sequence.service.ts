import { CounterModel } from "../models/counter.model";
import { Counter } from "../interfaces";

const DUPLICATE_KEY_ERROR_CODE = 11000;

const incrementCounter = (sequenceName: string): Promise<Counter | null> =>
  CounterModel.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true }
  )
    .lean<Counter>()
    .exec();

/**
 * First allocation on this database: the counter is created from the documents
 * which already exist. An `upsert` on the increment above cannot be used, it
 * would start the sequence at 1 and collide with all of them.
 */
const seedCounter = async (
  sequenceName: string,
  readHighestExistingValue: () => Promise<number>
): Promise<void> => {
  try {
    await CounterModel.create({
      _id: sequenceName,
      seq: await readHighestExistingValue(),
    });
  } catch (error) {
    // Another caller seeded it first, its value is the right one.
    if ((error as { code?: number })?.code !== DUPLICATE_KEY_ERROR_CODE) {
      throw error;
    }
  }
};

/**
 * Allocates the next value of a sequential identifier such as `user_id`.
 *
 * `$inc` is atomic, so two concurrent callers always get two different values.
 * Reading the current maximum and adding one, as was done before, left a window
 * between the read and the write where both callers picked the same value and
 * the second one violated the unique index.
 *
 * The counter is deliberately updated outside of any transaction: inside one,
 * concurrent callers would conflict on the counter document, and a rollback
 * would hand the same value out twice. A failed transaction therefore burns a
 * value, which only leaves a gap in the numbering.
 *
 * @param sequenceName             Name of the sequence, also the counter `_id`.
 * @param readHighestExistingValue Used once, to start the counter above the
 *                                 documents created before it existed.
 */
export const getNextSequence = async (
  sequenceName: string,
  readHighestExistingValue: () => Promise<number>
): Promise<number> => {
  const counter = await incrementCounter(sequenceName);

  if (counter) {
    return counter.seq;
  }

  await seedCounter(sequenceName, readHighestExistingValue);

  const seededCounter = await incrementCounter(sequenceName);

  if (!seededCounter) {
    throw new Error(`Failed to initialise the "${sequenceName}" sequence`);
  }

  return seededCounter.seq;
};

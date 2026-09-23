import mongoose from "mongoose";

import { Counter } from "../interfaces";

const CounterSchema = new mongoose.Schema<Counter>(
  {
    // The name of the sequence, such as `user_id` or `lieu_id`
    _id: { required: true, type: String },
    seq: { required: true, type: Number },
  },
  { strict: true, timestamps: true }
);

export const CounterModel = mongoose.model(
  "Counter",
  CounterSchema,
  "counters"
);

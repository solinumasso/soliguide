import mongoose from "mongoose";

import { connectToDatabase } from "./src/config/database/connection";
import { amqpEventsSender } from "./src/events";
import { logger } from "./src/general/logger";

mongoose.set("debug", false);

// Désactiver complètement les logs pendant les tests
logger.level = "silent";

// Ignorer les erreurs EPIPE qui peuvent survenir pendant les tests
// Ces erreurs sont souvent des race conditions inoffensives dans les tests
process.on("uncaughtException", (err: Error) => {
  if (
    err.message.includes("EPIPE") ||
    err.message.includes("write after end")
  ) {
    // Ignorer silencieusement ces erreurs de pipe cassé
    return;
  }
  // Relancer toutes les autres erreurs
  throw err;
});

process.on("unhandledRejection", (reason: unknown) => {
  const err = reason as Error;
  if (
    err?.message?.includes("EPIPE") ||
    err?.message?.includes("write after end")
  ) {
    // Ignorer silencieusement ces erreurs de pipe cassé
    return;
  }
  // Relancer toutes les autres erreurs
  throw reason;
});

// Établir la connexion avant tous les tests
beforeAll(async () => {
  await connectToDatabase();
});

afterAll(async () => {
  mongoose.connection.close();
  await amqpEventsSender.close();
});

// skipcq: JS-0321, JS-0009
afterEach(() => {});

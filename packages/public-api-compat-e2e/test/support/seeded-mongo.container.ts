import { GenericContainer, StartedTestContainer } from "testcontainers";

import { seedCompatibilityDatabase } from "./compatibility.seed";

export type SeededMongoContainer = {
  container: StartedTestContainer;
  hostMongoUri: string;
  stop: () => Promise<void>;
};

const RETRIES = 30;
const RETRY_DELAY_MS = 1000;

export async function startSeededMongoContainer(): Promise<SeededMongoContainer> {
  const container = await new GenericContainer("mongo:7.0")
    .withExposedPorts(27017)
    .withCommand(["--replSet", "rs0", "--bind_ip_all"])
    .start();

  const hostMongoUri = `mongodb://127.0.0.1:${container.getMappedPort(
    27017
  )}/soliguide_test?replicaSet=rs0&directConnection=true`;

  try {
    await waitForMongo(container);
    await initReplicaSet(container);
    await waitForPrimary(container);
    await seedCompatibilityDatabase(hostMongoUri);
  } catch (error) {
    await container.stop();
    throw error;
  }

  return {
    container,
    hostMongoUri,
    stop: async () => {
      await container.stop();
    },
  };
}

async function waitForMongo(container: StartedTestContainer): Promise<void> {
  await retry(
    async () => {
      const result = await container.exec([
        "mongosh",
        "--quiet",
        "--eval",
        "db.runCommand({ ping: 1 })",
      ]);

      if (result.exitCode !== 0) {
        throw new Error(`MongoDB not ready yet: ${result.output}`);
      }
    },
    "MongoDB never became reachable"
  );
}

async function initReplicaSet(container: StartedTestContainer): Promise<void> {
  const result = await container.exec([
    "mongosh",
    "--quiet",
    "--eval",
    "try { rs.status(); } catch (error) { rs.initiate({_id:'rs0',members:[{_id:0,host:'127.0.0.1:27017'}]}); }",
  ]);

  if (result.exitCode !== 0) {
    throw new Error(`Could not initiate replica set: ${result.output}`);
  }
}

async function waitForPrimary(container: StartedTestContainer): Promise<void> {
  await retry(
    async () => {
      const result = await container.exec([
        "mongosh",
        "--quiet",
        "--eval",
        "const status = db.hello(); if (!status.isWritablePrimary) { quit(1); }",
      ]);

      if (result.exitCode !== 0) {
        throw new Error(`Replica set primary not ready: ${result.output}`);
      }
    },
    "Replica set never reached primary state"
  );
}

async function retry(
  task: () => Promise<void>,
  errorMessage: string
): Promise<void> {
  let attempts = 0;
  let lastError: unknown;

  while (attempts < RETRIES) {
    attempts += 1;

    try {
      await task();
      return;
    } catch (error) {
      lastError = error;
      await delay(RETRY_DELAY_MS);
    }
  }

  throw new Error(`${errorMessage}. Last error: ${String(lastError)}`);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

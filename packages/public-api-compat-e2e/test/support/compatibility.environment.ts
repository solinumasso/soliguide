import { ChildProcess } from "node:child_process";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

import { Categories, UserStatus, UserStatusNotLogged } from "@soliguide/common";
import { Collection, Document, MongoClient, ObjectId, WithId } from "mongodb";
import jwt from "jsonwebtoken";
import supertest from "supertest";

import {
  PERSONA_STATUS_BY_KEY,
  SEARCH_PERSONA_KEYS,
} from "./persona.constants";
import {
  LegacyApiSupertestAdapter,
  PublicApiSupertestAdapter,
} from "./http.adapters";
import {
  LegacyApiAdapter,
  PersonaContext,
  PersonaKey,
  PublicApiAdapter,
} from "./compatibility.types";
import { startSeededMongoContainer } from "./seeded-mongo.container";

export type CompatibilityEnvironment = {
  personas: Record<PersonaKey, PersonaContext>;
  legacyApiAdapter: LegacyApiAdapter;
  publicApiAdapter: PublicApiAdapter;
  dispose: () => Promise<void>;
};

type UserDocument = WithId<
  Document & {
    status: UserStatus;
    categoriesLimitations?: Categories[];
    blocked?: boolean;
    user_id: number;
  }
>;

type StartedProcess = {
  process: ChildProcess;
  processGroupId?: number;
  logs: () => {
    stdout: string;
    stderr: string;
  };
};

const JWT_SECRET = "compatibility-test-secret";
const LEGACY_API_PORT = 3519;
const NEW_API_PORT = 3520;

export async function createCompatibilityEnvironment(): Promise<CompatibilityEnvironment> {
  const mongoContainer = await startSeededMongoContainer();

  let legacyApiProcess: StartedProcess | undefined;
  let publicApiProcess: StartedProcess | undefined;

  try {
    const personas = await provisionPersonas(mongoContainer.hostMongoUri);

    legacyApiProcess = await startAppProcess({
      name: "legacy-api",
      command: "yarn",
      args: [
        "workspace",
        "@soliguide/api",
        "run",
        "ts-node",
        "--transpile-only",
        "src/app.ts",
      ],
      env: {
        NODE_ENV: "compat",
        ENV: "compat",
        PORT: String(LEGACY_API_PORT),
        MONGODB_URI: mongoContainer.hostMongoUri,
        JWT_SECRET,
        S3_ACCESS_KEY: "minioadmin",
        S3_SECRET_KEY: "minioadmin",
        DEV_ANON: "false",
        CRON_ENABLED: "false",
        AMQP_URL: "",
      },
    });

    publicApiProcess = await startAppProcess({
      name: "public-api",
      command: "yarn",
      args: [
        "workspace",
        "@soliguide/public-api",
        "run",
        "ts-node",
        "--transpile-only",
        "src/main.ts",
      ],
      env: {
        NODE_ENV: "compat",
        ENV: "compat",
        PORT: String(NEW_API_PORT),
        MONGODB_URI: mongoContainer.hostMongoUri,
        JWT_SECRET,
        S3_ACCESS_KEY: "minioadmin",
        S3_SECRET_KEY: "minioadmin",
        DEV_ANON: "false",
        CRON_ENABLED: "false",
        AMQP_URL: "",
      },
    });

    await Promise.all([
      waitForHttpServer(LEGACY_API_PORT, "legacy-api", legacyApiProcess),
      waitForHttpServer(NEW_API_PORT, "public-api", publicApiProcess),
    ]);

    const legacyApiAdapter = new LegacyApiSupertestAdapter(
      supertest(`http://127.0.0.1:${LEGACY_API_PORT}`),
    );
    const publicApiAdapter = new PublicApiSupertestAdapter(
      supertest(`http://127.0.0.1:${NEW_API_PORT}`),
    );

    return {
      personas,
      legacyApiAdapter,
      publicApiAdapter,
      dispose: async () => {
        if (publicApiProcess) {
          await stopAppProcess(publicApiProcess, "public-api");
        }
        if (legacyApiProcess) {
          await stopAppProcess(legacyApiProcess, "legacy-api");
        }
        await mongoContainer.stop();
      },
    };
  } catch (error) {
    if (publicApiProcess) {
      await stopAppProcess(publicApiProcess, "public-api");
    }
    if (legacyApiProcess) {
      await stopAppProcess(legacyApiProcess, "legacy-api");
    }
    await mongoContainer.stop();
    throw error;
  }
}

async function provisionPersonas(
  mongoUri: string,
): Promise<Record<PersonaKey, PersonaContext>> {
  const mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();

  try {
    const usersCollection = mongoClient
      .db("soliguide_test")
      .collection<UserDocument>("users");

    const personasByKey: Partial<Record<PersonaKey, PersonaContext>> = {
      NOT_LOGGED: {
        key: "NOT_LOGGED",
        status: UserStatusNotLogged.NOT_LOGGED,
        isLogged: false,
      },
    };

    let nextUserId = await getNextUserId(usersCollection);

    for (const key of SEARCH_PERSONA_KEYS) {
      if (key === "NOT_LOGGED") {
        continue;
      }

      const status = PERSONA_STATUS_BY_KEY[key];
      const existingUser = await findReusableUserByStatus(
        usersCollection,
        status,
      );

      const user =
        existingUser ??
        (await createSyntheticUser(usersCollection, {
          sequence: nextUserId++,
          status,
        }));

      const userObjectId = user._id.toHexString();

      personasByKey[key] = {
        key,
        status,
        isLogged: true,
        publicApiUserId: userObjectId,
        legacyUserObjectId: userObjectId,
        legacyJwt: jwt.sign({ _id: userObjectId }, JWT_SECRET, {
          expiresIn: "60 days",
        }),
        categoriesLimitations: Array.isArray(user.categoriesLimitations)
          ? user.categoriesLimitations
          : undefined,
      };
    }

    return personasByKey as Record<PersonaKey, PersonaContext>;
  } finally {
    await mongoClient.close();
  }
}

async function findReusableUserByStatus(
  usersCollection: Collection<UserDocument>,
  status: PersonaContext["status"],
): Promise<UserDocument | null> {
  if (status === UserStatusNotLogged.NOT_LOGGED) {
    return null;
  }

  const query: Record<string, unknown> = {
    status,
    verified: true,
  };

  if (status === UserStatus.API_USER) {
    query.blocked = { $ne: true };
  }

  return usersCollection.findOne(query, {
    sort: {
      updatedAt: -1,
      createdAt: -1,
    },
  });
}

async function getNextUserId(
  usersCollection: Collection<UserDocument>,
): Promise<number> {
  const highest = await usersCollection.findOne(
    {},
    {
      projection: { user_id: 1 },
      sort: { user_id: -1 },
    },
  );

  return typeof highest?.user_id === "number" ? highest.user_id + 1 : 100_000;
}

async function createSyntheticUser(
  usersCollection: Collection<UserDocument>,
  params: {
    sequence: number;
    status: PersonaContext["status"];
  },
): Promise<UserDocument> {
  if (params.status === UserStatusNotLogged.NOT_LOGGED) {
    throw new Error("Cannot create NOT_LOGGED user document");
  }

  const suffix = `${params.status.toLowerCase()}-${params.sequence}`;
  const now = new Date();
  const document: Record<string, unknown> & { _id: ObjectId } = {
    _id: new ObjectId(),
    areas: {
      fr: {
        departments: ["75"],
      },
    },
    blocked: false,
    categoriesLimitations: [],
    invitations: [],
    languages: [],
    lastname: `Compat ${suffix}`,
    mail: `compat.${suffix}@soliguide.dev`,
    name: `Compat ${suffix}`,
    organizations: [],
    password: "compatibility-test-password",
    selectedOrgaIndex: 0,
    status: params.status,
    territories: ["75"],
    title: null,
    translator: false,
    user_id: params.sequence,
    verified: true,
    verifiedAt: now,
    createdAt: now,
    updatedAt: now,
  };
  await usersCollection.insertOne(document as UserDocument);

  const insertedUser = await usersCollection.findOne({ _id: document._id });

  if (!insertedUser) {
    throw new Error("Could not read back synthetic user");
  }

  return insertedUser;
}

async function startAppProcess(params: {
  name: string;
  command: string;
  args: string[];
  env: Record<string, string>;
}): Promise<StartedProcess> {
  const childProcess = spawn(params.command, params.args, {
    cwd: process.cwd(),
    detached: process.platform !== "win32",
    env: {
      ...process.env,
      ...params.env,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];

  childProcess.stdout?.on("data", (chunk) => {
    const value = chunk.toString();
    stdoutChunks.push(value);
    if (stdoutChunks.length > 30) {
      stdoutChunks.shift();
    }
  });

  childProcess.stderr?.on("data", (chunk) => {
    const value = chunk.toString();
    stderrChunks.push(value);
    if (stderrChunks.length > 30) {
      stderrChunks.shift();
    }
  });

  await delay(400);

  if (childProcess.exitCode !== null) {
    throw new Error(
      `${params.name} exited prematurely with code ${childProcess.exitCode}\nstdout:\n${stdoutChunks.join(
        "",
      )}\nstderr:\n${stderrChunks.join("")}`,
    );
  }

  return {
    process: childProcess,
    processGroupId:
      process.platform !== "win32" ? childProcess.pid ?? undefined : undefined,
    logs: () => ({
      stdout: stdoutChunks.join(""),
      stderr: stderrChunks.join(""),
    }),
  };
}

async function waitForHttpServer(
  port: number,
  serviceName: string,
  startedProcess: StartedProcess,
): Promise<void> {
  const deadlineMs = 60_000;
  const startedAt = Date.now();

  while (Date.now() - startedAt < deadlineMs) {
    if (startedProcess.process.exitCode !== null) {
      const logs = startedProcess.logs();
      throw new Error(
        `${serviceName} exited before becoming reachable (code ${startedProcess.process.exitCode})\nstdout:\n${logs.stdout}\nstderr:\n${logs.stderr}`,
      );
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1000);
      await fetch(`http://127.0.0.1:${port}/`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return;
    } catch {
      await delay(300);
    }
  }

  const logs = startedProcess.logs();
  throw new Error(
    `${serviceName} did not become reachable on port ${port}\nstdout:\n${logs.stdout}\nstderr:\n${logs.stderr}`,
  );
}

async function stopAppProcess(
  startedProcess: StartedProcess,
  name: string,
): Promise<void> {
  const processRef = startedProcess.process;

  if (processRef.exitCode !== null) {
    return;
  }

  sendSignalToProcessTree(startedProcess, "SIGTERM");

  const exitedAfterTerm = await waitFor(
    () => !isStartedProcessAlive(startedProcess),
    8_000,
    100,
  );

  if (exitedAfterTerm) {
    return;
  }

  sendSignalToProcessTree(startedProcess, "SIGKILL");

  const exitedAfterKill = await waitFor(
    () => !isStartedProcessAlive(startedProcess),
    4_000,
    100,
  );

  if (!exitedAfterKill) {
    throw new Error(`${name} process could not be stopped`);
  }
}

function sendSignalToProcessTree(
  startedProcess: StartedProcess,
  signal: NodeJS.Signals,
): void {
  const processGroupId = startedProcess.processGroupId;

  if (processGroupId && process.platform !== "win32") {
    try {
      process.kill(-processGroupId, signal);
      return;
    } catch (error) {
      if (!isMissingProcessError(error)) {
        throw error;
      }
    }
  }

  try {
    startedProcess.process.kill(signal);
  } catch (error) {
    if (!isMissingProcessError(error)) {
      throw error;
    }
  }
}

function isStartedProcessAlive(startedProcess: StartedProcess): boolean {
  const processGroupId = startedProcess.processGroupId;

  if (processGroupId && process.platform !== "win32") {
    return isPidAlive(-processGroupId);
  }

  const pid = startedProcess.process.pid;
  return typeof pid === "number" ? isPidAlive(pid) : false;
}

function isPidAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return !isMissingProcessError(error);
  }
}

function isMissingProcessError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "ESRCH"
  );
}

async function waitFor(
  condition: () => boolean,
  timeoutMs: number,
  stepMs: number,
): Promise<boolean> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (condition()) {
      return true;
    }

    await delay(stepMs);
  }

  return condition();
}

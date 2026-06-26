import "../models/cron-log.model";

import { completeCronLog, failCronLog, startCronLog } from "./cron-log.service";
import { CronLogName, CronLogStatus } from "../enums";
import { CronLogModel } from "../models/cron-log.model";

describe("CronLogService", () => {
  const createdLogIds: string[] = [];

  afterAll(async () => {
    if (createdLogIds.length) {
      await CronLogModel.deleteMany({ _id: { $in: createdLogIds } });
    }
  });

  describe("startCronLog", () => {
    it("Should create a RUNNING log with a name and a start date", async () => {
      const cronLogId = await startCronLog(CronLogName.SET_IS_OPEN_TODAY);
      createdLogIds.push(cronLogId.toString());

      const cronLog = await CronLogModel.findById(cronLogId).lean();

      expect(cronLog).not.toBeNull();
      expect(cronLog?.name).toBe(CronLogName.SET_IS_OPEN_TODAY);
      expect(cronLog?.status).toBe(CronLogStatus.RUNNING);
      expect(cronLog?.startedAt).toBeInstanceOf(Date);
      expect(cronLog?.finishedAt).toBeNull();
      expect(cronLog?.context).toEqual({});
    });
  });

  describe("completeCronLog", () => {
    it("Should mark the log as SUCCESS and store the execution duration", async () => {
      const startedAt = new Date(Date.now() - 1000);
      const cronLogId = await startCronLog(CronLogName.SET_CURRENT_TEMP_INFO);
      createdLogIds.push(cronLogId.toString());

      await completeCronLog(cronLogId, startedAt, {
        docsToUpdate: 3,
        docsUpdated: 2,
      });

      const cronLog = await CronLogModel.findById(cronLogId).lean();

      expect(cronLog?.status).toBe(CronLogStatus.SUCCESS);
      expect(cronLog?.finishedAt).toBeInstanceOf(Date);
      expect(cronLog?.durationMs).toBeGreaterThanOrEqual(0);
      expect(cronLog?.context).toEqual({
        docsToUpdate: 3,
        docsUpdated: 2,
      });
    });
  });

  describe("failCronLog", () => {
    it("Should mark the log as FAILED and store the error message", async () => {
      const startedAt = new Date();
      const cronLogId = await startCronLog(CronLogName.TRANSLATE_FIELDS);
      createdLogIds.push(cronLogId.toString());

      await failCronLog(cronLogId, startedAt, new Error("boom"), {
        docsFailed: 1,
        docsUpdated: 4,
      });

      const cronLog = await CronLogModel.findById(cronLogId).lean();

      expect(cronLog?.status).toBe(CronLogStatus.FAILED);
      expect(cronLog?.finishedAt).toBeInstanceOf(Date);
      expect(cronLog?.error).toBe("boom");
      expect(cronLog?.context).toEqual({
        docsFailed: 1,
        docsUpdated: 4,
      });
    });
  });
});

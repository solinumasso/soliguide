import { Readable } from "node:stream";
import type { Logger } from "pino";
import {
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { CONFIG } from "../../_models/config/constants/CONFIG.const";
import { ExpressRequest, ExpressResponse } from "../../_models";

export const s3Client: S3Client = new S3Client({
  // Useless in our case
  region: "fr-fr",
  endpoint: CONFIG.S3_ENDPOINT,
  credentials: {
    accessKeyId: CONFIG.S3_ACCESS_KEY,
    secretAccessKey: CONFIG.S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

export const getObject = async (bucket: string, file: string) => {
  return await s3Client.send(
    new GetObjectCommand({ Bucket: bucket, Key: file })
  );
};

export const deleteObject = async (bucket: string, file: string) => {
  return await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: file,
    })
  );
};

export const sendObject = async (
  bucket: string,
  file: string,
  res: ExpressResponse,
  logger: Logger
) => {
  try {
    const readObjectResult = await getObject(bucket, file);

    if (readObjectResult.CacheControl)
      res.setHeader("cache-control", readObjectResult.CacheControl);
    if (readObjectResult.ContentDisposition)
      res.setHeader("content-disposition", readObjectResult.ContentDisposition);
    if (readObjectResult.ContentEncoding)
      res.setHeader("content-encoding", readObjectResult.ContentEncoding);
    if (readObjectResult.ContentLanguage)
      res.setHeader("content-encoding", readObjectResult.ContentLanguage);
    if (readObjectResult.ContentLength)
      res.setHeader("content-length", readObjectResult.ContentLength);
    if (readObjectResult.ContentRange)
      res.setHeader("content-range", readObjectResult.ContentRange);
    res.setHeader(
      "content-type",
      readObjectResult.ContentType || "application/octet-stream"
    );

    if (!(readObjectResult.Body instanceof Readable)) {
      logger.warn(`File ${file} is empty`);
      return res.status(204);
    }
    if (!readObjectResult.Body) {
      logger.error(`File ${file} is unreadable`);
      return res.status(500);
    }
    return readObjectResult.Body.pipe(res);
  } catch (err) {
    if (err.Code && err.Code === "NoSuchKey") {
      return res.status(404);
    }
    logger.error(err);
    return res.status(500).json({ message: "GET_FILE_ERROR" });
  }
};

export const s3Middleware = (bucket: string) => {
  return async (req: ExpressRequest, res: ExpressResponse) => {
    // This will get everything in the path following the mountpath
    let s3Key = decodeURIComponent(
      req.originalUrl.substring(req.baseUrl.length + 1)
    );

    // If the key is empty (this occurs if a request comes in for a url ending in '/'), and there is a defaultKey
    // option present on options, use the default key
    // E.g. if someone wants to route '/' to '/index.html'
    if (s3Key === "") {
      const error = new Error("Bad request: no file specified");
      req.log.warn(error);
      return res.status(400).json({ message: "NO_FILE_SPECIFIED" });
    }

    // Chop off the querystring, it causes problems with SDK.
    const queryIndex = s3Key.indexOf("?");
    if (queryIndex !== -1) {
      s3Key = s3Key.substring(0, queryIndex);
    }
    return await sendObject(bucket, s3Key, res, req.log);
  };
};

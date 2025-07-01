import { Queue } from "bullmq";
import IORedis from "ioredis"

const connection = new IORedis({
host: 'localhost',
  port: 6378,
  maxRetriesPerRequest: null
});

export const submissionQueue = new Queue('submissions', { connection });


import { Worker, JobData } from "bullmq";
import IORedis from "ioredis"
import { DBConnection } from "./db.js";

import { runCode } from "./controllers/execController.js";

try {
   DBConnection();
} catch (err) {
  console.log("failed to connect to database", err);
}

const connection = new IORedis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null
});

export interface CompileData {
  submissionId: string,
}

const worker = new Worker<CompileData>(
  'submissions',
  async (job) => {
    runCode(job.data.submissionId);
  },
  { connection }
);

console.log('Worker is running...');

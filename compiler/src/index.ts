// import { Worker, JobData } from "bullmq";
// import IORedis from "ioredis"
// import { DBConnection } from "./db.js";
//
// import { runCode } from "./controllers/execController.js";
//
// try {
//    DBConnection();
// } catch (err) {
//   console.log("failed to connect to database", err);
// }
//
// const connection = new IORedis({
//   host: 'localhost',
//   port: 6379,
//   maxRetriesPerRequest: null
// });
//
// export interface CompileData {
//   submissionId: string,
// }
//
// const worker = new Worker<CompileData>(
//   'submissions',
//   async (job) => {
//     runCode(job.data.submissionId);
//   },
//   { connection }
// );
//
// console.log('Worker is running...');
//
import express, { Application, Request, Response } from 'express';
import "dotenv/config.js";
import { DBConnection } from './db.js';
import { Authenticate } from './middleware/authentication.js';
import execRoutes from './routes/execRoutes.js';
import { warn } from 'console';

const PORT = process.env.PORT || 4000;

try {
  DBConnection();
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}

const app: Application = express();
// app.use("/", Authenticate);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "working" });
  return;
})

app.use("/", execRoutes);

app.listen(PORT, () => {
  console.log('server is RUNNING ON', PORT);
})

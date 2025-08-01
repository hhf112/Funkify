import express, { Application, Request, Response } from 'express';

import "dotenv/config.js";
import { DBConnection } from './db.js';
import { Authenticate } from './middleware/authentication.js';
import SubmissionRoutes from './routes/submissionRoutes.js';
import publicProblemRoutes from "./routes/publicProblemRoutes.js"
import userProblemRoutes from "./routes/userProblemRoutes.js"
import TestRoutes from './routes/systemTestRoutes.js';
import userAIRoutes from "./routes/userAIRoutes.js";
// import UserRoutes from './routes/userRoutes.js';
import cors from "cors";
import { rateLimit } from "express-rate-limit"
import { userInfo } from 'os';


const PORT = process.env.PORT || 3000;

try {
  DBConnection();
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}


const app: Application = express();

app.use(cors({
  origin: process.env.FRONTEND,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "working" });
  return;
})


/* Public routes */
app.use("/api/problems", publicProblemRoutes)


/* User routes */
app.use("/api/user", Authenticate);
app.use("/api/user/problems", userProblemRoutes)
app.use("/api/user/tests", TestRoutes)
app.use('/api/user/submissions', SubmissionRoutes);



const limiter_hour = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24H
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 56,
})

const limiter_minute = rateLimit({
  windowMs: 1000 * 60, // 1m
  limit: 2,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 56,
})

app.use('/api/user/ai',
  limiter_hour,
  limiter_minute,
  userAIRoutes); // 5/24h




app.listen(PORT, () => {
  console.log('server is RUNNING ON', PORT);
})

import { Request, Response } from "express"
import mongoose from "mongoose"
import "dotenv/config"


const MONGO_URL: string | undefined = process.env.MONGO_URL;
if (!MONGO_URL) {
  throw new Error("MONGO_URL is not defined in the environment variables");
  process.exit(1);
}

export const DBConnection = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      autoIndex: true,
    })
    // has implied unique index
    const Problem = (await import("../models/problem.model.js")).Problem;
    const Submission = (await import("../models/submission.model.js")).Submission;
    const Tests = (await import("../models/tests.model.js")).Tests;
    const User = (await import("../models/user.model.js")).User;
    await Submission.syncIndexes();
    await Problem.syncIndexes();
    await Tests.syncIndexes();
    await User.syncIndexes();

    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}



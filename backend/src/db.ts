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
    const Problem = (await import("./models/problemModels/Problem.js")).default;
    await Problem.syncIndexes();

    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}



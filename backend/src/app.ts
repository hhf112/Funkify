import routes from "./routes/v1/index.js";

import express, { Application, Request, Response } from 'express';
import "dotenv/config.js";
import cors from "cors";
import cookieParser from 'cookie-parser';

export const app = express();

app.use(cors({
  origin: process.env.FRONTEND,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", routes)


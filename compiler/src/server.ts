import express, { Application, Request, Response } from 'express';
import "dotenv/config.js";
import { DBConnection } from './db.js';
import { Authenticate } from './middleware/authentication.js';

import execRoutes from "./routes/execRoutes.js"


try {
  DBConnection();
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}

const app: Application = express();
app.use("/", Authenticate);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "working"
  })
  return;
})

app.use("/judge", execRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('server is RUNNING ON', PORT);
})

import express, { Application, Request, Response } from 'express';
import "dotenv/config.js";
import { DBConnection } from './db.js';
import { Authenticate } from './middleware/authentication.js';
import execRoutes from './routes/comRoutes.js';
import { warn } from 'console';
import cors from "cors"


const PORT: number  | null  = parseInt(process.env.PORT || "4000", 10);
if (!PORT) {
  console.log("port not found")
  process.exit(1);
}

try {
  DBConnection();
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}

const app: Application = express();

app.use(cors());
//
// app.use("/", Authenticate);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "working" });
  return;
})

app.use("/", execRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log('server is RUNNING ON', PORT);
})

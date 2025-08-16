import express, { Application, Request, Response } from 'express';
import "dotenv/config.js";
import { Authenticate } from './middleware/authentication.js';
import execRoutes from './routes/exec.routes.js';
import cors from "cors"
import { Compile } from './middleware/compilation.js';


const PORT: number  | null  = parseInt(process.env.PORT || "4000", 10);
if (!PORT) {
  console.log("port not found")
  process.exit(1);
}


export const app = express();

app.use(cors());
app.use(Authenticate);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "working" });
  return;
})

app.use("/api/compiler", execRoutes);

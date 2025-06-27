import express, { Application, Request, Response } from 'express';
import "dotenv/config.js";
import { DBConnection } from './db.js';
import { Authenticate } from './middleware/authentication.js';


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

const PORT = process.env.PORT || 3000;
import JudgeRoutes from './routes/judgeRoutes.js';
import ProblemsRoutes from './routes/problemRoutes.js';

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "working" });
  return;
})
app.use('/api/judge', JudgeRoutes);
app.use('/api/problems', ProblemsRoutes);



app.listen(PORT, () => {
  console.log('server is RUNNING ON', PORT);
})

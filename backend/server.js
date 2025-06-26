import express from 'express';
import "dotenv/config.js";
import { DBConnection } from './db.js';


try {
  DBConnection();
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
import JudgeRoutes from './routes/Judge.js';
import ProblemsRoutes from './routes/Problems.js';

app.use('/api/judge', JudgeRoutes);
app.use('/api/problems', ProblemsRoutes);



app.listen(PORT, () => {
  console.log('Server is runnniong on port', PORT);
})

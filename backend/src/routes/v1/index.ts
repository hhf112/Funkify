import SubmissionRoutes from './submission.routes.js';
import problemRoutes from "./problem.routes.js";
import TestRoutes from "./tests.routes.js";
import AIRoutes from "./ai.routes.js";
import { limiter_hour, limiter_minute } from '../../middleware/rateLimit.js';
import { Request, Response, Router } from 'express';

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "v1 working",
    timestamp: new Date().toLocaleString(),
  });
  return;
})

router.use('/problem', problemRoutes)
router.use('/tests', TestRoutes)
router.use('/submissions', SubmissionRoutes);

// rate limited 
router.use('/ai',
  limiter_hour,
  limiter_minute,
  AIRoutes); // 5/24h 

router.use((req: Request, res: Response) => {
  res.status(404).json({ error: "v1: Route not found" });
});

export default router;

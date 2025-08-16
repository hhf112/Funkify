import submissionRoutes from './submission.routes.js';
import problemRoutes from "./problem.routes.js";
import testRoutes from "./tests.routes.js";
import aiRoutes from "./ai.routes.js";
import authRoutes from "./auth.routes.js";
import { limitHour, limitMinute } from '../../middleware/rateLimit.js';
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
router.use('/tests', testRoutes)
router.use('/submissions', submissionRoutes);
router.use("/auth", authRoutes);

// rate limited 
router.use('/ai', limitHour, limitMinute, aiRoutes);

router.use((req: Request, res: Response) => {
  res.status(404).json({ error: "v1: Route not found" });
});

export default router;

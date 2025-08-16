import { Router } from "express";
import {
  getHint,
  getSolution,
  getSummary
} from "../../controllers/ai.controller.js"
import { Authenticate } from "../../middleware/authentication.js";


const router = Router()

router.use('/', Authenticate);
router.get("/summary/:problemId", getSummary)
router.get("/hint/:problemId", getHint)
// router.get("/solution/:problemId", getSolution)

export default router



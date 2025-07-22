import { Router } from "express";
import {
  getSummary
} from "../controllers/userAIController.js"


const router = Router()

router.get("/sum/:problemId", getSummary)

export default router



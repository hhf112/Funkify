import { Router } from "express";
import {
  getSummary
} from "../../controllers/ai.controller.js"


const router = Router()

router.get("/sum/:problemId", getSummary)

export default router



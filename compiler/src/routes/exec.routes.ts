import { Router } from "express";
import {
  getSubmissionById,
  runCode,
  submitCode,

} from "../controllers/exec.controller.js";
import { Compile } from "../middleware/compilation.js";

const router = Router();

router.post('/submit', Compile, submitCode);
router.post('/run', Compile, runCode); 

export default router;

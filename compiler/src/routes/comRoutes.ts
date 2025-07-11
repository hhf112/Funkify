import { Router } from "express";
import {
    runCode,
  submitCode,

} from "../controllers/comController.js";

const router = Router();

router.post('/', submitCode);
router.post('/run', runCode );



export default router;

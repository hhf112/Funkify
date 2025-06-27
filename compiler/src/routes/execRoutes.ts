import { Router } from "express";
import { 
  runCode

} from "../controllers/execController.js";

const router = Router();

router.post('/', runCode);



export default router;

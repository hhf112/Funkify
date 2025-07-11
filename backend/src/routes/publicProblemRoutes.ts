import express from 'express';
import { 
  getProblemById,
  getProblemsByCount,
} from '../controllers/publicProblemController.js';


const router = express.Router();


router.get('/count', getProblemsByCount); // query param
router.get('/:problemId', getProblemById);


export default router;



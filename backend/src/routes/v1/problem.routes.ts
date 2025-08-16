import express from 'express';
import { 
  getProblemById,
  getProblemsByCount,
  getProblemsByUserId,
  createProblem,
  updateProblem,
  deleteProblem
} from '../../controllers/problem.controller.js';
import { Authenticate } from '../../middleware/authentication.js';


const router = express.Router();

// public
router.get('/count', getProblemsByCount); // /count?count=10
router.get('/id/:problemId', getProblemById);



// protected
router.get('/user', Authenticate, getProblemsByUserId);
router.put('/create', Authenticate, createProblem);
router.post('/update', Authenticate, updateProblem);
router.delete('/delete', Authenticate, deleteProblem);


export default router;



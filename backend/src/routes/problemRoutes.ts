import express from 'express';
import { 
  getProblemsByCount,
  getProblemsByUserId,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
} from '../controllers/problemController.js';


const router = express.Router();



router.get('/', getProblemsByCount); //count in request query
router.get('/user', getProblemsByUserId);
router.put('/add', createProblem);
router.post('/mod', updateProblem);
router.delete('/del', deleteProblem);
router.get('/:problemId', getProblemById); 


export default router;



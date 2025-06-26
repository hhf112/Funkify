import express from 'express';
import { 
  getProblemsByCount,
  getProblemByUserId,
  createProblem,
  updateProblem,
  deleteProblem,
} from '../controllers/ProblemsController.js';


const router = express.Router();



router.get('/', getProblemsByCount); //count in request query
router.get('/:problemId', getProbleById); 
router.get('/user', getProblemsByUserId);
router.put('/add', createProblem);
router.post('/mod', updateProblem);
router.delete('/del', deleteProblem);


export default router;



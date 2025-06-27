import express from 'express';
import { 
  getProblemsByCount,
  getProblemsByUserId,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
} from '../controllers/problemController';


const router = express.Router();



router.get('/', getProblemsByCount); //count in request query
router.get('/:problemId', getProblemById); 
router.get('/user', getProblemsByUserId);
router.put('/add', createProblem);
router.post('/mod', updateProblem);
router.delete('/del', deleteProblem);


export default router;



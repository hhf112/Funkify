import express from 'express';
import { 
  getProblemsByUserId,
  createProblem,
  updateProblem,
  deleteProblem,
} from '../controllers/userProblemController.js';


const router = express.Router();



router.get('/user', getProblemsByUserId);
router.put('/add', createProblem);
router.post('/mod', updateProblem);
router.delete('/del', deleteProblem);


export default router;



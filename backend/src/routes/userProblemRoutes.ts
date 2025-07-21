import express from 'express';
import { 
  getProblemsByUserId,
  createProblem,
  updateProblem,
  deleteProblem,
  getSummary,
} from '../controllers/userProblemController.js';


const router = express.Router();



router.get('/user', getProblemsByUserId);
router.put('/add', createProblem);
router.post('/mod', updateProblem);
router.delete('/del', deleteProblem);
router.get("/sum/:problemId", getSummary);


export default router;



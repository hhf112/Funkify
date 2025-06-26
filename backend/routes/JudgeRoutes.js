import express from 'express';
import {
  submit,
  getSubmissionById,
  getSubmissionsByProblemId,
  getSubmissionsByUserId,
  getSubmissionsByProblemIdAndUserId,
} from '../controllers/JudgeController.js';


router.post('/', submit);
router.get('/user', getSubmissionsByUserId);
router.get('problem/:problemId', getSubmissionsByProblemId);
router.get('/by', getSubmissionsByProblemIdAndUserId);



export default router;



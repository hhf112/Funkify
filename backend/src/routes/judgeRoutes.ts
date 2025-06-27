import express, { Router } from 'express';
import {
  createSubmission,
  getSubmissionById,
  getSubmissionsByProblemId,
  getSubmissionsByUserId,
  getSubmissionByProblemIdAndUserId,
} from '../controllers/submissionController.js';

const router = Router();


router.post('/', createSubmission);
router.get('/user/:userId', getSubmissionsByUserId);
router.get('/problem/:problemId', getSubmissionsByProblemId);
router.get('/for/:userId/:problemId', getSubmissionByProblemIdAndUserId);



export default router;



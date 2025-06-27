import express, { Router } from 'express';
import {
  submit,
  getSubmissionById,
  getSubmissionsByProblemId,
  getSubmissionsByUserId,
  getSubmissionByProblemIdAndUserId,
} from '../controllers/submissionController.js';

const router = Router();


router.post('/', submit);
router.get('/user/:userId', getSubmissionsByUserId);
router.get('/problem/:problemId', getSubmissionsByProblemId);
router.get('/for/:userId/:problemId', getSubmissionByProblemIdAndUserId);



export default router;



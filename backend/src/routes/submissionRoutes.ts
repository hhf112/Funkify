import express, { Router } from 'express';
import {
  createSubmission,
  getSubmissionById,
  getSubmissionsByProblemId,
  getSubmissionsByUserId,
  getSubmissionByProblemIdAndUserId,
  getVerdictById,
} from '../controllers/submissionController.js';

const router = Router();


router.post('/', createSubmission);
router.get('/user/:userId', getSubmissionsByUserId);
router.get('/problem/:problemId', getSubmissionsByProblemId);
router.get('/for', getSubmissionByProblemIdAndUserId);
router.get('/:submissionId', getSubmissionById);
router.get("/verdict/:verdictId", getVerdictById)

export default router;



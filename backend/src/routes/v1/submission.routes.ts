import express, { Router } from 'express';
import {
  createSubmission,
  getSubmissionById,
  getSubmissionsByProblemId,
  getSubmissionsByUserId,
  getSubmissionByProblemIdAndUserId,
  getVerdictById,
} from '../../controllers/submission.controller.js';
import { Authenticate } from '../../middleware/authentication.js';
import { warn } from 'console';

const router = Router();


router.use('/', Authenticate);

router.post('/', createSubmission);
router.get('/user/:userId', getSubmissionsByUserId);
router.get('/problem/:problemId', getSubmissionsByProblemId);
router.get('/for', getSubmissionByProblemIdAndUserId); // userId=&problemId=
router.get("/verdict/:verdictId", getVerdictById)
router.get('/:submissionId', getSubmissionById);

export default router;



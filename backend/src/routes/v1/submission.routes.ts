import express, { Router } from 'express';
import {
  getSubmissionById,
} from '../../controllers/submission.controller.js';
import { Authenticate } from '../../middleware/authentication.js';

const router = Router();

router.get('/:submissionId', Authenticate, getSubmissionById);

export default router;



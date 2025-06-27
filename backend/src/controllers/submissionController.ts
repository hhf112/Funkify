import { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';
import Submission from '../models/Submission'

export const submit = async (req: Request, res: Response) => {
  try {
    const { userId, problemId, code, language } = req.body;
    if (!userId || !problemId || !code || !language) {
       res.status(400).json({ error: 'Required fields are not filled' });
       return;
    }
    const submission = new Model('Submission')({
      userId,
      problemId,
      code,
      language,
      status: 'pending',
      submissionTime: new Date(),
      verdictId: null,
    });

    await submission.save();
    res.status(201).json(submission);
    return;
  } catch (error) {
    console.error('Error submitting solution:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
}

export const getSubmissionsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const submissions = await Submission.find({ userId });
    if (!submissions || submissions.length === 0) {
      res.status(404).json({ error: 'No submissions found for this user' });
      return;
    }
    res.status(200).json(submissions);
    return;
  } catch (error) {
    console.error('Error fetching submissions by user ID:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
}

export const getSubmissionById = async (req: Request, res: Response) => {
  try {
    const { submissionId } = req.params;
    const submission = await mongoose.model('submissions').findById(submissionId);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.status(200).json(submission);
    return;
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
}

export const getSubmissionsByProblemId = async (req: Request, res: Response) => {
  try {
    const { problemId } = req.params;
    const submissions = await mongoose.model('submissions').find({ problemId });
    if (!submissions) {
       res.status(404).json({ error: 'No submissions found for this problem' });
       return;
    }
    res.status(200).json(submissions);
    return
  } catch (error) {
    console.error('Error fetching submissions by problem ID:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
}

export const getSubmissionByProblemIdAndUserId = async (req: Request, res: Response) => {
  try {
    const { userId, problemId } = req.params;
    const submissions = await mongoose.model('submissions').find({ userId, problemId });
    if (!submissions) {
      res.status(404).json({ error: 'No submission found for this user and problem' });
    }
     res.status(200).json(submissions);
     return;
  } catch (error) {
    console.error('Error fetching submission by user ID and problem ID:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
}


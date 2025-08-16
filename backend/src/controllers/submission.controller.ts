import { Request, Response } from 'express';
import { Submission } from '../models/submission.model.js';
import type { SubmissionType } from "../models/submission.model.js";


export const getSubmissionById = async (req: Request, res: Response) => {
  const submissionId = req.params.submissionId as string;
  if (!submissionId) {
    res.status(400).json({
      success: false,
      message: "submissionId is required.",
    });
    return;
  }

  try {
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      res.status(404).json({
        success: false,
        message: "submission not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      submission: submission,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

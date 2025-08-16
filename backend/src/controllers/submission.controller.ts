import { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';
import "dotenv/config.js";
import { Submission, SubmissionType } from '../models/submission.model.js'
import { Problem, type ProblemType } from '../models/problem.model.js';
import { Verdict, type VerdictType } from '../models/verdict.model.js';

const compiler = process.env.COMPILER;

export const getVerdictById = async (req: Request, res: Response) => {
  const { verdictId } = req.params;
  if (!verdictId) {
    res.status(400).json({
      success: true,
      message: "verdictId not provided",
    });
    return;
  }
  try {
    const verdict = await Verdict.findById(verdictId);
    if (!verdict) throw new Error("verdict not found");
    res.status(200).json({
      success: true,
      message: "Found verdict",
      verdict: verdict,
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const createSubmission = async (req: Request, res: Response) => {
  let submission: SubmissionType;
  const {
    problemId,
    userId,
    code,
    language,
    testId,
  } = req.body;
  if (!problemId || !userId || !code || !language || !testId) {
    res.status(400).json({
      success: false,
      message: "Required fields not provied",
    })
    return;
  }

  try {
    const newSubmission = await Submission.create({
      problemId,
      userId,
      code,
      language,
      testId,
    });


    const dopost = fetch(`${compiler}/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        submissionId: newSubmission._id,
      }),
    })
    res.status(200).json({
      success: true,
      message: "Submission successfully added to queue.",
      submissionId: newSubmission._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server error"
    });
  }
}

export const getSubmissionsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {

      res.status(400).json({
        success: false,
        message: "user Id is required",
      });
      return;
    }

    const submissions = await Submission.find({ userId });

    if (!submissions || submissions.length === 0) {
      res.status(404).json({
        success: false,
        message: "No submissions found matching userId",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Submissions found",
      submissions: submissions,
    });
    return;
  } catch (error: any) {
    console.error('Error fetching submissions by user ID:', error);
    res.status(500).json({
      success: false,
      error: error.name,
      message: error.message,
    });
    return;
  }
}

export const getSubmissionById = async (req: Request, res: Response) => {
  try {
    const { submissionId } = req.params;
    if (!submissionId) {
      res.status(400).json({
        success: false,
        message: "submission Id is required",
      });
      return;
    }

    const submission = await Submission.findById(submissionId);

    if (!submission) {
      res.status(404).json({
        success: false,
        message: "no submission found matching with provied Id",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "submission found",
      submission: submission,
    });
  } catch (error: any) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      success: false,
      error: error.name,
      message: error.message,
    });
    return;
  }
}

export const getSubmissionsByProblemId = async (req: Request, res: Response) => {
  try {
    const { problemId } = req.params;
    if (!problemId) {
      res.status(400).json({
        success: false,
        message: "problem Id is required",
      });
      return;
    }

    const submissions = await Submission.find({ problemId });
    if (!submissions) {
      res.status(404).json({
        sucesses: false,
        message: "No submissions found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Submission found",
      submissions: submissions,
    });
  } catch (error: any) {
    console.error('Error fetching submissions by problem ID:', error);
    res.status(500).json({
      success: false,
      error: error.name,
      message: error.message,
    });
    return;
  }
}

export const getSubmissionByProblemIdAndUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const problemId = req.query.problemId as string;

    if (!userId || !problemId) {

      res.status(400).json({
        success: false,
        message: "Required fields not provided",
      })
      return;
    }
    const submissions = await Submission.find({ userId, problemId });
    if (!submissions || !submissions.length) {
      res.status(404).json({
        success: false,
        message: "Submissions not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Submission found",
      submissions: submissions,
    });
  } catch (error: any) {
    console.error('Error fetching submission by user ID and problem ID:', error);
    res.status(500).json({
      success: false,
      error: error.name,
      message: error.message,
    });
    return;
  }
}


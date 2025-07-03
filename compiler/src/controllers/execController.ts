import { Request, Response } from 'express';
import Submission from '../models/Submission.js';
import type { SubmissionType } from '../models/Submission.js';
import Verdict from '../models/Verdict.js';

import { generateFile } from './generateFile.js';

import { execCpp } from "./runCpp.js"
import { ExecFileException } from 'child_process';
import { MongooseError } from 'mongoose';
import Problem from '../models/Problem.js';

function runTests(filename: string) {

}

// export const runCode = async (submissionId: string) => {
export const runCode = async (req: Request, res: Response) => {
  console.log("this is called");
  console.log(req.body);
  const submissionId = req.body.submissionId;
  if (!submissionId) {
    res.status(400).json({
      success: false,
      message: "submissionId required"
    })
  }

  let submission: SubmissionType | null = null;
  try {
    submission = await Submission.findById(submissionId);
  } catch (err) {
    console.log(err);
    return;
  }

  if (submission == null) return;
  let filePath: string;
  let inputPath: string;

  let problem;
  try {
    problem = await Problem.findById(submission.ProblemId);
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "submission problem not found",
    })
  }
  if (!problem) return;

  const inputs: string[] = problem.sampleTests.map((test: {
    input: string,
    output: string,
  }) => test.input);

  // check for fs error.
  try {
    filePath = await generateFile("../../codes/", submission.language, submission.code);
    inputPath = await generateFile("../../input", "txt", "");
  } catch (error: Error | any) {
    console.error("fs error for submissionId: ", submissionId);
    return;
  }


  let output = "";
  let runtime_ms = 0;
  // check for exec error.
  try {
    const start: [number, number] = process.hrtime();
    if (submission.language === "cpp") {
      output = await execCpp(filePath, inputPath);
    }
    const end: [number, number] = process.hrtime(start);
    runtime_ms = end[1] * 1000000;

    // check for mongoose error.
    try {
      const { _id } = await Verdict.create({
        plagReportID: null,
        submissionId: submissionId,
        userId: submission.userId,
        output: output,
        verdict: "Accepted",
      })

      res.status(200).json({
        success: true,
        message: "verdict created successfully",
        verdictId: _id,
      });

    } catch (error: MongooseError | any) {
      let err: MongooseError;
      console.error("Error creating verdict: ", filePath, error);
    }
  } catch (error: ExecFileException | any) {
    // check for mongoose error.
    try {
      const verdict = runTests(filePath);
      await Verdict.create({
        plagReportID: null,
        error: true,
        errorMessage: error.message,
        submissionId: submissionId,
        userId: submission.userId,
        output: output,
        verdict: "Accepted",
        runtime_ms: runtime_ms,
      })
    } catch (error: MongooseError | any) {
      res.status(500).json({
        successs: true,
        message: "failed to create verdict",
      })
      console.error("Error creating verdict: ", filePath, error);
    }
  }
}



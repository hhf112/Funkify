/* default */
import { Request, Response } from 'express';

/* models and types */
import Submission from '../models/Submission.js';
import Verdict from '../models/Verdict.js';
import Problem from '../models/Problem.js';
import SystemTests from '../models/SystemTests.js';
import type { SubmissionType } from '../models/Submission.js';
import type { ProblemType } from '../models/Problem.js';
import type { SystemTestsType } from '../models/SystemTests.js';

/* impl */
import { runTests } from './runTests.js';
import { generateFile } from './generateFile.js';
import { execCpp } from "./runCpp.js"


/* Languages supported */
const langs: Record<string, any> = {
  "cpp": execCpp,
}

export const runCode = async (req: Request, res: Response) => {
  const submissionId = req.body.submissionId;
  if (!submissionId) {
    console.log("wrong submisssion")
    res.status(400).json({
      success: true,
      message: "submissionId required."
    })
    return;
  }

  let submission: SubmissionType | null;
  let tests: SystemTestsType | null;
  try {
    submission = await Submission.findById(submissionId);
    tests = await SystemTests.findById(submission?.problemId);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "internal server error",
    })
    return;
  }
  if (!submission || !tests) {
    console.log("submission or problem not found")
    res.status(404).json({
      success: true,
      message: "submission or tests not found",
    })
    return;
  }

  let filePath: string;
  let inputPath: string;
  try {
    filePath = await generateFile("../../codes/", submission.language, submission.code);
    inputPath = await generateFile("../../input", "txt", "");
  } catch (error: Error | any) {
    console.error("fs error for submissionId: ", submissionId);
    return;
  }

  const inputs = "", outputs = "";
  tests.tests.forEach((test: {
    input: string,
    output: string,
  }) => {
    inputs.concat(test.input)
    outputs.concat(test.output)
  });

  // check for exec error.
  try {
    const start: [number, number] = process.hrtime();
    const output = await langs[submission.language](filePath, inputPath, submission.constraints.runtime_s);
    const end: [number, number] = process.hrtime(start);
    const verdict = runTests(output, outputs, tests.linesPerTestcase);
    // check for mongoose error.
    try {
      const { _id } = await Verdict.create({
        plagReportID: null,
        submissionId: submissionId,
        userId: submission.userId,
        output: output,
        verdict: verdict,
      })

      res.status(200).json({
        success: true,
        message: "verdict created successfully",
        verdictId: _id,
      });

      console.log("job completed: ", filePath);

    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Internal server Error",
      })
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

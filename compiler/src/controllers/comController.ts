/* default */
import { Request, Response } from 'express';

/* models and types */
import Submission from '../models/Submission.js';
import Verdict, { VerdictType } from '../models/Verdict.js';
import Problem from '../models/Problem.js';
import SystemTests from '../models/SystemTests.js';
import type { SubmissionType } from '../models/Submission.js';
import type { ProblemType } from '../models/Problem.js';
import type { SystemTestsType } from '../models/SystemTests.js';

/* impl */
import { generateFile } from './generateFile.js';
import { execCpp, OutputType } from "./runCpp.js"
import { ResultType } from '../models/Verdict.js';


/* Languages supported */
const runFor: Record<string, any> = {
  "cpp": execCpp,
}


export const runCode = async (req: Request, res: Response) => {
  const {
    code,
    language,
    tests,
    timeLimit, // seconds
    linesPerTestCase,
  } = req.body;

  if (!code || !language || !tests) {
    res.status(400).json({
      success: true,
      message: "Required fields not provided.",
    })
    return;
  }

  const codeFile = generateFile("../../codes", language, code);

  let passed = 0;
  const results: { output: string, verdict: ResultType }[] = new Array(tests.length);
  let verdict: ResultType, output: OutputType;
  let testno = 0;
  for (const test of tests) {
    const start: [number, number] = process.hrtime();
    try {
      output = await runFor[language](codeFile, test.input, timeLimit);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Internal server error."
      });
      return;
    }
    const end: [number, number] = process.hrtime(start);
    if (output.error == null) {
      if (output.stdout.trim() == test.output.trim()) {
        passed++;
        verdict = {
          verdict: "Accepted",
          passed: true,
          error: null,
        }
      }
      else {
        verdict = {
          verdict: "Wrong Answer",
          passed: false,
          error: null,
        }
      }
      if (end[0] / 1000000 > timeLimit)
        verdict.verdict = "Time Limit Exceeded";
    } else {
      verdict = {
        verdict: (output.compilation ? "Runtime Error" : "Compilation Error"),
        passed: false,
        error: {
          stderr: output.stderr,
          error: output.error,
        }
      }
    }
    results[testno++] = { output: output.stdout.trim(), verdict }
  }
  res.status(200).json({
    success: true,
    message: "job finished.",
    results: results,
    passsed: (passed == tests.length),
  })
}

export const submitCode = async (req: Request, res: Response) => {
  const submissionId = req.body.submissionId;
  if (!submissionId) {
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
    tests = await SystemTests.findById(submission?.testId);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Database error.",
    })
    return;
  }

  if (!submission || !tests) {
    res.status(404).json({
      success: true,
      message: "submission or tests not found",
    })
    return;
  }

  const filePath: string = generateFile("../../codes/", submission.language, submission.code);

  await Submission.findByIdAndUpdate(submissionId, {
    status: "processing",
  });

  const results: ResultType[] = new Array(tests.tests.length);

  const finalVerdict: VerdictType = {
    verdict: "Accepted",
    results: [],
    submissionId: submissionId,
    userId: submission.userId,
    memory_mb: 0,
    runtime_ms: -1,
    testsPassed: 0,
    totalTests: tests.tests.length,
  }

  try {
    let testno = 0, passed = 0;
    let output: OutputType, verdict: ResultType;
    for (const test of tests.tests) {
      const start: [number, number] = process.hrtime();
      try {
        output = await runFor[submission.language](filePath, test.input,
          tests.runtime_s);
      } catch (err) {
        console.log(err);
        res.status(500).json({
          success: false,
          message: "Internal server error."
        });
        return;
      }
      const end: [number, number] = process.hrtime(start);

      /* error handling */
      if (output.error == null) {
        if (output.stdout.trim() === test.output.trim()) {
          passed++;
          verdict = {
            verdict: "Accepted",
            passed: true,
            error: null,
          }
        }
        else {
          verdict = {
            verdict: "Wrong Answer",
            passed: false,
            error: null,
          }
          if (finalVerdict.verdict === "Accepted")
            finalVerdict.verdict = verdict.verdict;
        }
        if (end[0] > submission.constraints.runtime_s)
          verdict.verdict = "Time Limit Exceeded";
        else finalVerdict.runtime_ms = end[0] / 1000000;
      } else {
        verdict = {
          verdict: (output.compilation ? "Runtime Error" : "Compilation Error"),
          passed: false,
          error: {
            stderr: output.stderr,
            error: output.error,
          }
        }
        finalVerdict.verdict = verdict.verdict;
        finalVerdict.error = verdict.error;
      }
      results[testno++] = verdict;
    }

    finalVerdict.testsPassed = passed;
    finalVerdict.results = results;

    try {
      const { _id } = await Verdict.create(finalVerdict);

      await Submission.findByIdAndUpdate(submissionId, {
        status: "processed",
        verdictId: _id,
      });


      res.status(200).json({
        success: true,
        message: "successfuly updated verdict."
      })
    } catch (err) {
      console.log(err);

      await Submission.findByIdAndUpdate(submissionId, {
        status: "fail",
      });

      res.status(500).json({
        success: false,
        message: "Database Error."
      })
      return;
    }

  } catch (err) {
    console.log(err);

    await Submission.findByIdAndUpdate(submissionId, {
      status: "fail",
    });

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    })
  }
}



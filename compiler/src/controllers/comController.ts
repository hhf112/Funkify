/* default */
import { Request, Response } from 'express';
import fs from "fs"

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
      
      message: "Required fields not provided.",
    })
    return;
  }

  const codeFile = generateFile("../../codes", language, code);

  let passed = 0;
  const results: { test: string, output: string, verdict: ResultType }[] = new Array(tests.length);
  let verdict: ResultType, output: OutputType;
  let testno = 0;
  let finalVerdict: string | null = null;
  for (const test of tests) {
    const start: [number, number] = process.hrtime();
    try {
      output = await runFor[language](codeFile, test.input, timeLimit);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        
        message: "Internal server error."
      });
      return;
    }
    const end: [number, number] = process.hrtime(start);
    if (output.error === null) {
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
        if (!finalVerdict) finalVerdict = "Wrong Answer";
      }
    } else {
      verdict = {
        verdict: (output.compilation ?
          (output.error === "timed out." ? "Time Limit Exceeded" : "Runtime Error")
          : "Compilation Error"),
        passed: false,
        error: {
          stderr: output.stderr,
          error: output.error,
        }
      }
      finalVerdict = verdict.verdict;
    }
    results[testno++] = { test, output: output.stdout.trim(), verdict }
  }
  if (!finalVerdict) finalVerdict = "Accepted"
  res.status(200).json({
    finalVerdict: finalVerdict,
    
    message: "job finished.",
    results: results,
    passsed: (passed === tests.length),
  })
}

export const submitCode = async (req: Request, res: Response) => {
  const submissionId = req.body.submissionId;
  if (!submissionId) {
    res.status(400).json({
      
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
      
      message: "Database error.",
    })
    return;
  }

  if (!submission || !tests) {
    res.status(404).json({
      
      message: "submission or tests not found",
    })
    return;
  }

  const filePath: string = generateFile("../../codes/", submission.language, submission.code);

  await Submission.findByIdAndUpdate(submissionId, {
    status: "processing",
  });

  const results: ResultType[] = new Array(tests.tests.length).fill({
    verdict: "Compilation Error",
    error: null,
    passed: false,
  });

  const finalVerdict: VerdictType = {
    verdict: "",
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
          
          message: "Internal server error."
        });
        return;
      }
      const end: [number, number] = process.hrtime(start);

      fs.unlinkSync(filePath);

      /* error handling */
      if (output.error === null) {
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
          if (!finalVerdict.verdict) finalVerdict.verdict = verdict.verdict;
        }
      } else {
        verdict = {
          verdict: (output.compilation ? "Runtime Error" : "Compilation Error"),
          passed: false,
          error: {
            stderr: output.stderr,
            error: output.error,
          }
        }
        const err = verdict.error?.error;
        if (err && err == "timed out.") {
          finalVerdict.verdict = "Time Limit Exceeded";
          finalVerdict.error = verdict.error;
          break;
        } else finalVerdict.verdict = verdict.verdict;
        finalVerdict.error = verdict.error;
        if (!output.compilation) break;
      }
      results[testno++] = verdict;
    }


    if (!finalVerdict.verdict) finalVerdict.verdict = "Accepted";
    finalVerdict.testsPassed = passed;
    finalVerdict.results = results;

    try {
      console.log("final", finalVerdict);
      const { _id } = await Verdict.create(finalVerdict);

      await Submission.findByIdAndUpdate(submissionId, { status: "processed", verdictId: _id, });


      res.status(200).json({ message: "successfuly updated verdict." })
    } catch (err) {
      console.log(err);

      await Submission.findByIdAndUpdate(submissionId, {
        status: "fail",
      });

      res.status(500).json({ message: "Database Error." })
      return;
    }

  } catch (err) {
    console.log(err);

    await Submission.findByIdAndUpdate(submissionId, { status: "fail", });

    res.status(500).json({ message: "Internal server error.", })
  }
}



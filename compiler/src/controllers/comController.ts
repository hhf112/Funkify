/* default */
import { Request, Response } from 'express';
import path, { basename, dirname, format } from 'path';
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
import { ResultType } from '../models/Verdict.js';
import { timeLog, warn } from 'console';
import { CompileStatusType, cppCompile, cppExec, ExecStatusType } from './runCpp.js';
import { memoryUsage } from 'process';
import { CompletionInfoFlags } from 'typescript';


/* Languages supported */
const runFor: Record<string, any> = {
  "cpp": cppExec,
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
      success: false,
      message: "Required fields not provided or empty.",
    })
    return;
  }


  // if (language == "cpp")
  let binaryPath;
  try {
    const compileStatus: CompileStatusType = await cppCompile(code, language);
    if (!compileStatus.success || ! compileStatus.binaryPath) {
      res.status(200).json({
        success: false,
        finalVerdict: "Compilation Error",
        verdict: compileStatus,
        results: [{
          verdict: "Compilation Error.",
          error :{
            stderr: compileStatus.stderr,
            error: compileStatus.errorMessage,
          }
        }],
      });
      return;
    }
    binaryPath = compileStatus.binaryPath;
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
    return;
  }

  let verdict: ResultType;
  let output: ExecStatusType;
  let results: { test: string, output: string, verdict: ResultType }[] = [];
  let passed = 0;
  let finalVerdict: string | null = "Accepted";

  for (const test of tests) {
    try {
      output = await runFor[language](binaryPath, timeLimit);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Internal server error."
      });
      return;
    }

    if (output.errorMessage === null) {
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
        finalVerdict = "Wrong Answer";
      }
    } else {
      verdict = {
        verdict: output.errorMessage === "timed out." ? "Time Limit Exceeded" : "Runtime Error",
        passed: false,
        error: {
          stderr: output.stderr,
          error: output.errorMessage,
        }
      }
      finalVerdict = verdict.verdict;
      results = [...results, { test, output: output.stdout.trim(), verdict }]
      break;
    }

    results = [...results, { test, output: output.stdout.trim(), verdict }]
  }
  fs.unlinkSync(binaryPath);

  res.status(200).json({
    success: true,
    finalVerdict: finalVerdict,
    message: "Job finished.",
    results: results,
    passed: (passed === tests.length),
  })
}

export const submitCode = async (req: Request, res: Response) => {
  const submissionId = req.body.submissionId;
  if (!submissionId) {
    res.status(400).json({
      success: false,
      message: "submissionId required."
    })
    return;
  }

  let submission: SubmissionType | null;
  let tests: SystemTestsType | null;
  try {
    submission = await Submission.findById(submissionId);
    tests = await SystemTests.findById(submission?.testId);
    if (!submission || !tests) {
      res.status(404).json({
        success: false,
        message: "Submission or tests not found",
      })
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: true,
      message: "Database error.",
    })
    return;
  }


  let binaryPath;
  try {
    const compileStatus: CompileStatusType = await cppCompile(submission.code, submission.language);
    if (!compileStatus.success || !compileStatus.binaryPath) {
      try {
        const { _id } = await Verdict.create({
          verdict: "Compilation Error",
          error: {
            stderr: compileStatus.stderr,
            error: compileStatus.errorMessage,
          },
          results: [{
            verdict: "Compilation Error",
            passed: false,
            error: {
              stderr: compileStatus.stderr,
              error: compileStatus.errorMessage,
            }
          }],
          submissionId: submissionId,
          userId: submission.userId,
          memory_mb: 0,
          runtime_s: -1,
          testsPassed: 0,
          totalTests: 0,
        });

        await Submission.findByIdAndUpdate(submissionId, { status: "processed", verdictId: _id });


        res.status(200).json({
          success: true,
          message: "job processed.",
        })
      } catch (err) {
        console.log(err);
        res.status(500).json({
          success: false,
          message: "Database error.",
        })
      }
      return;
    }
    binaryPath = compileStatus.binaryPath;
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
    return;
  }

  try {
    await Submission.findByIdAndUpdate(submissionId, { status: "processing", });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: "Database error.",
    })
    return;
  }

  const finalVerdict: VerdictType = {
    error: null,
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
    let output: ExecStatusType, verdict: ResultType;
    for (const test of tests.tests) {
      try {
        output = await runFor[submission.language](binaryPath, tests.runtime_s);
      } catch (err) {
        console.log(err);
        res.status(500).json({
          success: false,
          message: "Internal server error."
        });
        return;
      }

      finalVerdict.runtime_ms = output.runtime_ms;
      if (output.errorMessage === null) {
        if (output.stdout.trim() === test.output.trim()) {
          finalVerdict.testsPassed++;
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
          finalVerdict.verdict = verdict.verdict;
        }
      } else {
        verdict = {
          verdict: output.errorMessage === "timed out." ? "Time Limit Exceeded" : "Runtime Error",
          passed: false,
          error: {
            stderr: output.stderr,
            error: output.errorMessage,
          }
        }
        finalVerdict.verdict = verdict.verdict;
        finalVerdict.error = verdict.error;
        finalVerdict.results = [...finalVerdict.results, verdict];
        break;
      }
      finalVerdict.results = [...finalVerdict.results, verdict];
    }
    fs.unlinkSync(binaryPath);
    finalVerdict.error = null;

    try {
      const { _id } = await Verdict.create(finalVerdict);
      await Submission.findByIdAndUpdate(submissionId, { status: "processed", verdictId: _id, });
      res.status(200).json({
        success: true,
        message: "Successfuly updated verdict."
      })
    } catch (err) {
      console.log(err);
      await Submission.findByIdAndUpdate(submissionId, { status: "fail" });

      res.status(500).json({
        success: false,
        message: "Database Error."
      })
      return;
    }
  } catch (err) {
    console.log(err);
    await Submission.findByIdAndUpdate(submissionId, { status: "fail", });
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    })
  }
}



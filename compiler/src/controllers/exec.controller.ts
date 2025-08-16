import { Request, Response } from 'express';

import Submission from '../models/submission.model.js';
import type { SubmissionType } from '../models/submission.model.js';
import { Tests } from '../models/tests.model.js';
import type { TestsType } from '../models/tests.model.js';

import { cppExec, ExecStatusType } from './runCpp.js';
import mongoose from 'mongoose';
import fs from "fs";
import { warn } from 'console';


const runFor: Record<string, any> = {
  "cpp": cppExec,
}

export const runCode = async (req: Request, res: Response) => {
  const binaryPath = req.body.binaryPath;
  const lang = req.body.lang;
  if (!req.body.tests || !req.body.timeLimit) {
    res.status(400).json({
      success: false,
      message: "tests are required.",
    })
    return;
  }

  const runStatus: {
    verdict: string,
    error?: {
      stderr: string,
      error: string,
    },
    results: {
      test: string,
      output: string,
      passed: boolean,
    }[],
    passed: number,
  } = {
    verdict: "Accepted",
    results: [],
    passed: 0,
  }

  try {
    for (const test of req.body.tests) {
      const output = await runFor[lang](binaryPath, req.body.timeLimit);

      if (output.errorMessage === null) {
        if (output.stdout.trim() == test.output.trim()) {
          runStatus.passed++;
          runStatus.results = [...runStatus.results, {
            test: test.input,
            passed: true,
            output: output.stdout,
          }];
        } else {
          runStatus.results = [...runStatus.results, {
            test: test.input,
            passed: false,
            output: output.stdout,
          }];
          runStatus.verdict = "Wrong Answer";
        }
      } else {
        runStatus.results = [...runStatus.results, {
          test: test.input,
          output: output.stdout,
          passed: false,
        }];
      }
      runStatus.verdict = output.errorMessage === "timed out." ? "Time Limit Exceeded" : "Runtime Error";
      runStatus.error = {
        stderr: output.stderr,
        error: output.errorMessage,
      }
      break;
    }
    fs.unlinkSync(binaryPath);

    res.status(200).json({
      success: true,
      runStatus: runStatus,
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    })
  }
}

export const submitCode = async (req: Request, res: Response) => {
  const binaryPath = req.body.binaryPath;
  const {
    testId,
    problemId,
    userId,
    code,
    language
  } = req.body;

  if (!testId || !language || !code || !problemId || !userId) {
    res.status(400).json({
      success: false,
      message: "required fields not provided."
    })
    return;
  }

  const submitStatus: {
    processed: boolean,
    fail: boolean,
    verdict: string,
    error?: {
      stderr: string,
      error: string,
    },
    results: boolean[],
    passed: number,
    total: number,
  } = {
    processed: false,
    fail: false,
    verdict: "Accepted",
    results: [],
    passed: 0,
    total: 0,
  }

  try {
    const tests = await Tests.findById(testId);
    if (!tests) {
      res.status(200).json({
        success: false,
        message: "tests do not exist",
      })
      return;
    }
    submitStatus.total = tests.tests.length;

    const { _id } = await Submission.create({
      problemId: problemId,
      userId: userId,
      code: code,
      lang: language,
      status: submitStatus,
    });

    res.status(200).json({
      success: true,
      submissionId: _id,
    });


    for (const test of tests.tests) {
      const output = await runFor[language](binaryPath, tests.runtime_s);

      if (output.errorMessage === null) {
        if (output.stdout.trim() === test.output.trim()) {
          submitStatus.passed++;
          submitStatus.results = [...submitStatus.results, true];
        }
        else {
          submitStatus.results = [...submitStatus.results, false];
          submitStatus.verdict = "Wrong Answer";
        }
      } else {
        submitStatus.results = [...submitStatus.results, false];
        submitStatus.verdict = output.errorMessage === "timed out." ? "Time Limit Exceeded" : "Runtime Error";
        submitStatus.error = {
          stderr: output.stderr,
          error: output.errorMessage,
        }
        break;
      }
    }
    submitStatus.processed = true;
    submitStatus.fail = false;
    fs.unlinkSync(binaryPath);

    await Submission.findByIdAndUpdate(_id, { status: submitStatus });
  } catch (err: any) {
    console.log(err);
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json({
        success: false,
        message: "Invalid testId.",
      })
      return;
    } else if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        success: false,
        message: "Invalid submission data.",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    })
  }
}


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

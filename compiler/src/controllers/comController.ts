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
import { runTests } from './runTests.js';
import { generateFile } from './generateFile.js';
import { execCpp, OutputType } from "./runCpp.js"


/* Languages supported */
const runFor: Record<string, any> = {
  "cpp": execCpp,
}


export const runCode = async (req: Request, res: Response) => {
  const {
    code,
    language,
    tests,
    timeLimit,
    linesPerTestCase,
  } = req.body;



  console.log("code:", code);
  if (!code || !language || !tests) {
    res.status(400).json({
      success: true,
      message: "Required fields not provided.",
    })
    return;
  }

  const codeFile = generateFile("../../codes", language, code);

  const ordered_results: { output: string, verdict: { verdict: string, testsPassed: number, error: string | null } }[] = new Array(tests.length);
  const tot_tests = tests.length
  for (let i = 0; i < tot_tests; i++) {
    const output = await runFor[language](codeFile, tests[i].input);
    const verdict = runTests(output.stdout, tests[i].output, linesPerTestCase);
    ordered_results[i] = {output, verdict}
  }

  res.status(200).json({
    success: true,
    message: "job finished.",
    ordered_results: ordered_results,
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
      message: "internal server error",
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


  let inputs = "";
  let outputs = "";
  tests.tests.forEach((test: {
    input: string,
    output: string,
  }) => {
    inputs += test.input;
    outputs += test.output;
  });


  let filePath: string;
  let inputPath: string;
  try {
    filePath = generateFile("../../codes/", submission.language, submission.code);
    inputPath = generateFile("../../input", "txt", inputs);
  } catch (error: Error | any) {
    console.error("fs error for submissionId: ", submissionId);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
    return;
  }


  await Submission.findByIdAndUpdate(submissionId, {
    status: "processing",
  });

  let output: OutputType;
  let runtime_s_ns: [number, number];
  try {
    const start: [number, number] = process.hrtime();
    output = await runFor[submission.language](filePath, inputs);
    console.log(output);
    runtime_s_ns = process.hrtime(start);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error."
    })
    return;
  }


  if (output.error == null) {
    let { verdict, testsPassed, error } = await runTests(output.stdout,
      tests.tests.map((test: { input: string, output: string }) => test.output), tests.linesPerTestCase)

    if (runtime_s_ns[1] > submission.constraints.runtime_s * 1000) verdict = "Time Limit Exceeded";
    try {
      const { _id } = await Verdict.create({
        submissionId: submissionId,
        userId: submission.userId,
        error: error,
        stdout: output.stdout,
        stderr: output.stderr,
        verdict: verdict,
        memory_mb: null,
        runtime_ms: runtime_s_ns[1] / 1000000,
        testsPassed: testsPassed,
        totalTests: tests.tests.length,
      })

      await Submission.findByIdAndUpdate(submissionId, { status: "processed", verdictId: _id });
      res.status(200).json({
        success: true,
        message: "successfully processed verdict.",
      })

    } catch (err) {
      console.log(err);
      res.status(500).json({
        succcess: false,
        message: "Database Error.",
      })
    }
  }

  else {
    let verdict = (output.compilation ?
      "Runtime Error" : "Compilation Error");

    if (runtime_s_ns[1] > submission.constraints.runtime_s * 1000) verdict = "Time Limit Exceeded";
    try {
      const { _id } = await Verdict.create({
        verdict: verdict,
        submissionId: submissionId,
        userId: submission.userId,
        error: output.error,
        stdout: output.stdout,
        stderr: output.stderr,
        memory_mb: null,
        runtime_ms: runtime_s_ns[1] / 1000000,
        testsPassed: 0,
        totalTests: tests.tests.length,
      })

      await Submission.findByIdAndUpdate(submissionId, { status: "processed", verdictId: _id });
      res.status(200).json({
        success: true,
        message: "successfully processed verdict.",
      })
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Database Error",
      })
    }
  }
}


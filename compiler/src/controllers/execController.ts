import { Request, Response } from 'express';
import Submission from '../models/Submission.js';
import type { SubmissionType } from '../models/Submission.js';
import Verdict from '../models/Verdict.js';

import { generateFile } from './generateFile.js';

import { execCpp } from "./runCpp.js"
import { ExecFileException } from 'child_process';
import { MongooseError } from 'mongoose';

export const runCode = async (submissionId: string) => {
  let submission : SubmissionType | null = null;
  try {
    submission = await Submission.findById(submissionId);
  } catch (err) {
    console.log(err);
    return;
  }

  if (submission == null) return;
  let filePath: string;
  let inputPath: string;

  // check for fs error.
  try {
    filePath = await generateFile("../../codes/", submission.language, submission.code);
    inputPath = await generateFile("../../input", "txt", "");
  } catch (error: Error | any) {
    console.error("fs error for submissionId: ", submissionId);
    return;
  }


  let output = "";
  // check for exec error.
  try {
    if (submission.language === "cpp") {
      output = await execCpp(filePath, inputPath);
    }
    console.error("file processed: ", filePath);

    // check for mongoose error.
    try {
      const { _id } = await Verdict.create({
        plagReportID: null,
        submissionId: submissionId,
        userId: submission.userId,
        output: output,
        verdict: "Accepted",
      })

    } catch (error: MongooseError | any) {
      let err: MongooseError;
      console.error("Error creating verdict: ", filePath, error);
    }
  } catch (error: ExecFileException | any) {
    console.error("Job finished: ", filePath);

    // check for mongoose error.
    try {
      await Verdict.create({
        plagReportID: null,
        error: true,
        errorMessage: error.message,
        submissionId: submissionId,
        userId: submission.userId,
        output: output,
        verdict: "Accepted",
      })
    } catch (error: MongooseError | any) {
      console.error("Error creating verdict: ", filePath, error);
    }
  }
}



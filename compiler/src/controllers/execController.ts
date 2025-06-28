import { Request, Response } from 'express';
import Submission from '../models/Submission.js';
import Verdict from '../models/Verdict.js';

import { generateFile } from './generateFile.js';

import { execCpp } from "./runCpp.js"
import { ExecFileException } from 'child_process';
import { MongooseError } from 'mongoose';


export const runCode = async (req: Request, res: Response) => {
  const {
    format,
    tests,
    code,
    submissionId,
    userId
  } = req.body;

  if (!format || !tests || !code || !submissionId || !userId) {
    res.status(400).json({
      success: false,
      message: "Required fields not provided.",
    })
    return;
  }

  let filePath: string;
  let inputPath: string;

  // check for fs error.
  try {
    filePath = await generateFile("../../codes/", format, code);
    inputPath = await generateFile("../../input", "txt", "");
  } catch (error: Error | any) {
    console.error("fs error for submissionId: ", submissionId);
    res.status(500).json({
      success: false,
      error: error.code,
      message: "Internal server error."
    })
    return;
  }


  let output = "";
  // check for exec error.
  try {
    if (format === "cpp") {
      output = await execCpp(filePath, inputPath);
    }
    console.error("file processed: ", filePath);

    // check for mongoose error.
    try {
      const { _id } = await Verdict.create({
        plagReportID: null,
        submissionId: submissionId,
        userId: userId,
        output: output,
        verdict: "Accepted",
      })

      res.status(200).json({
        success: true,
        message: "Job finished",
        verdictId: _id,
      })
    } catch (error: MongooseError | any) {
      let err: MongooseError;
      console.error("Error creating verdict: ", filePath, error);
      res.status(500).json({
        success: false,
        message: "Database error."
      })
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
        userId: userId,
        output: output,
        verdict: "Accepted",
      })
      res.status(500).json({
        success: false,
        error: error.code,
        message: "Execution error."
      })
    } catch (error: MongooseError | any) {
      console.error("Error creating verdict: ", filePath, error);
      res.status(500).json({
        success: false,
        message: "Database error.",
      })
    }
  }
}



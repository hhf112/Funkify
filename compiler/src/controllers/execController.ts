import { Request, Response } from 'express';
import Submission from '../models/Submission.js';
import Verdict from '../models/Verdict.js';

import { generateFile } from './generateFile.js';

import { execCpp } from "./runCpp.js"
import { ExecFileException } from 'child_process';


export const runCode = async (req: Request, res: Response) => {
  const {
    format,
    tests,
    code,
    submissionId,
    userId
  } = req.body;

  if (!format || !tests || !code || !submissionId || !userId) {
    res.status(400).json({ error: "required fields not provided" })
    return;
  }

  //generate required files
  let filePath: string;
  let inputPath: string;
  try {
    filePath = await generateFile("../../codes/", format, code);
    inputPath = await generateFile("../../input", "txt", "");
  } catch (error: Error | any) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.code,
      message: "Internal server error."
    })
    return;
  }


  // run code
  let output = "";
  try {
    if (format === "cpp") {
      output = await execCpp(filePath, inputPath);
    }
  } catch (error: ExecFileException | any) {
    console.log(error);
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
      message: "execution error."
    })
    return;
  }

  // create verdict object
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
      message: "Job finsihed",
      verdictId: _id,
    })
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.code,
      message: "Internal Server Error."
    })
  }
}


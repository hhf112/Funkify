
import { Request, Response } from 'express';
import Submission from '../models/Submission.js';
import Verdict from '../models/Verdict.js';

import { generateFile } from './impl/generateFile.js';
import { generateInputFile } from './impl/generateInput.js';

import { execCpp } from "./impl/execCpp.js"


export const runCode = async (req: Request, res: Response) => {
  const { format, tests, code, language, submissionId, userId} = req.body;
  if (!format || !tests || !code || !language || !submissionId || userId) {
    res.status(400).json({ error: "required fields not provied" })
    return;
  }

  try {
    const filePath = await generateFile(format, "");
    const inputPath = await generateInputFile(tests);
    
    let output: string;
    if (language === "cpp") {
      output = await execCpp(filePath, inputPath);
    }

    Verdict.create({
      plagReportID: null,
      compile: true,
      runtime: true,
      errorMessage: null,
      submissionId: submissionId,
      userId: userId,
    })

    
    res.status(200).json({
      success: true,
      message: "job finsihed",
      verdictId: "",
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "processing error"
    })
  }
}


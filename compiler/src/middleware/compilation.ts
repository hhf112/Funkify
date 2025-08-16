import { cppCompile, type CompileStatusType } from "../controllers/runCpp.js";
import { Request, Response, NextFunction } from "express";

export const Compile = async (req: Request, res: Response, next: NextFunction) => {
  const submission = req.body;

  if (!submission.code || !submission.language) {
    res.status(400).json({
      success: false,
      message: "code and language must be provided.",
    })
    return;
  }

  try {
    const compileStatus: CompileStatusType = await cppCompile(submission.code, submission.language);
    if (!compileStatus.success || !compileStatus.binaryPath) {
      res.status(200).json({
        success: false,
        compileStatus: {
          processed: true,
          fail: true,
          verdict: "Compilation Error",
          error: {
            stderr: compileStatus.stderr,
            error: compileStatus.errorMessage,
          },
          results: [false],
          passed: 0,
          total: -1,
        }
      })
      return;
    }

    req.body.binaryPath = compileStatus.binaryPath;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    })
  }
}

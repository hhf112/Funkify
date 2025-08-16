import { Request, Response } from "express"
import { Tests, type TestType } from "../models/tests.model.js"
import { Problem, type ProblemType } from "../models/problem.model.js"


export const addTests = async (req: Request, res: Response) => {
  const {
    problemId,
    tests,
    author,
    linesPerTestCase,
  } = req.body;

  if (!problemId || !tests || !author) {
    res.status(400).json({
      success: false,
      message: "Required fileds not filled: problemId, tests, author"
    });
    return;
  }

  try {
    const systests = await Tests.create({
      problemId,
      tests,
      author,
      linesPerTestCase,
    });


    // console.log(systests);
    await Problem.findOneAndUpdate({ _id: problemId }, { testId: systests._id });
    res.status(200).json({
      success: true,
      message: "System tests added successfully",
      systemTests: systests,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}






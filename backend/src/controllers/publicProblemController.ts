import {Request, Response} from "express"
import Problem from "../models/problemModels/Problem.js";

export const getProblemsByCount = async (req: Request, res: Response) => {
  try {
    const count = parseInt(req.query.count as string) || 1;
    const problems = await Problem.find().limit(count);
    res.status(200).json({
      success: true,
      message: "Found problems",
      problems: problems,
    });
    return;
  } catch (error: any) {
    console.error('Error fetching problems:', error);
    res.status(500).json({
      success: false,
      error: error.name,
      message: error.message,
    });
    return;
  }
}


export const getProblemById = async (req: Request, res: Response) => {
  const problemId: string = req.params.problemId;
  if (!problemId) {
    res.status(400).json({ error: 'Problem ID is required' });
    return;
  }
  try {
    const problem = await Problem.findById(problemId).exec();
    if (!problem) {
      res.status(404).json({
        success: false,
        message: "No problems found",
        problem: problem,
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Found problem successfully",
      problem: problem
    })
    return;
  } catch (error: any) {
    console.error('Error fetching problem by ID:', error);
    res.status(500).json({
      success: false,
      error: error.name,
      message: error.message,
    });
    return;
  }
}



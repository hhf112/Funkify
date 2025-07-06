import { Request, Response } from 'express';
import Problem from '../models/problemModels/Problem.js';
import { Error, MongooseError } from 'mongoose';
import { ObjectId } from 'mongoose';
import { Types } from 'mongoose';
import { ProblemType } from '../models/problemModels/Problem.js';
import { warn } from 'console';
import SystemTests from '../models/submissionModels/SystemTests.js';


export const createProblem = async (req: Request, res: Response) => {
  console.log(req.body);
  const {
    difficulty,
    description,
    title,
    tags,
    sampleTests,
    constraints,
    testSolution,
  } = req.body;
  if (!difficulty || !description || !title || !tags || 
      !sampleTests || !constraints || !testSolution ) {
    res.status(400).json({
      success: false,
      message: "Required fields not provied",
    });
    return;
  }

  try {
    const newProblem = await Problem.create({
      difficulty,
      description,
      title,
      tags,
      sampleTests,
      constraints,
      testSolution,
    });

    await SystemTests.create({
      problemId: newProblem._id,
      tested: false,
      tests: sampleTests,
    })

    res.status(200).json({
      success: true,
      message: "Problem created successfully",
      problem: newProblem,
    })
  } catch (error: any) {
    console.error('Error creating problem:', error);
    res.status(500).json({
      success: false,
      error: error.name,
      message: error.message,
    });
    return;
  }
}


export const updateProblem = async (req: Request, res: Response) => {
  console.log("called updateProblem")
  const { problemId, updationData } = req.body;
  if (!problemId || !updationData) {
    res.status(400).json({ error: "Problem ID and updation data is required" });
    return;
  }

  try {
    const updatedProblem = await Problem.findByIdAndUpdate(problemId, updationData, { new: true });
    if (!updatedProblem) {
      res.status(404).json({ error: 'Problem not found' });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem: updatedProblem,
    });
  } catch (error: any) {
    console.error('Error updating problem:', error);
    res.status(500).json({
      success: false,
      error: error.name,
      message: error.message,
    });
    return;
  }
}


export const deleteProblem = async (req: Request, res: Response) => {
  console.log("called deleteProblem")
  const problemId = req.body.problemId;
  if (!problemId) {
    res.status(400).json({ error: 'Problem ID is required' });
    return;
  }

  try {
    const deletedProblem = await Problem.findByIdAndDelete(problemId);
    if (!deletedProblem) {
      res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Problem deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting problem:', error);
    res.status(500).json({
      success: false,
      error: error.name,
      message: error.message,
    });
  }
}
export const getProblemsByCount = async (req: Request, res: Response) => {
  console.log("called getProblemsByCount")
  try {
    const count = parseInt(req.query.count as string) || 1;
    const problems = await Problem.find().limit(count);
    res.status(200).json({
      success: true,
      message: "Found expected number of problems",
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
  console.log("called getProblemById")
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

export const getProblemsByUserId = async (req: Request, res: Response) => {

  console.log("called getProblemsByUserId")
  const userId = req.query.userId?.toString();
  if (!userId) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }
  try {
    const problems = await Problem.find({ userId: userId });
    if (problems.length === 0) {
      res.status(404).json({
        success: false,
        message: "No problems found matching by userId"
      })
      return;
    }
    res.status(200).json({
      success: true,
      message: "found problems by userId",
      problems: problems,
    });
  } catch (error: any) {
    console.error('Error fetching problems by user ID:', error);
    res.status(500).json({
      success: false,
      error: error.name,
      message: error.message,
    });
  }
}


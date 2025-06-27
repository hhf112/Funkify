import { Request, Response } from 'express';
import Problem from '../models/Problem.js';
import { Error, MongooseError } from 'mongoose';


export const createProblem = async (req: Request, res: Response) => {
  const { title,
    description,
    difficulty,
    tags,
    author,
    sampleTests,
    constraints,
    userId,
    testSolution } = req.body;
  console.log(req.body)

  if (!title || !description || !difficulty || !testSolution) {
    res.status(400).json({ error: 'Title, description, difficulty, and test solution are required' });
    return;
  }
  try {
    const newProblem = await Problem.create({
      title,
      description,
      difficulty,
      userId,
      testSolution,
      tags: tags || [],
    });
    res.status(200).json({
      success: true,
      message: "Problem created successfully",
      problem: newProblem,
    })
  } catch (error: any) {
    console.error('Error creating problem:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
    return;
  }
}


export const updateProblem = async (req: Request, res: Response) => {
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
      error: "Database Error",
      message: error.message,
    });
    return;
  }
}


export const deleteProblem = async (req: Request, res: Response) => {
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
  const problemId = req.params.problemId;
  if (!problemId) {
    res.status(400).json({ error: 'Problem ID is required' });
    return;
  }
  try {
    const problem = await Problem.findById(problemId);
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


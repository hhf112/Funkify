import { Request, Response } from 'express';
import Problem from '../models/Problem.js';


export const createProblem = async (req: Request, res: Response) => {
  const { title,
    description,
    difficulty,
    tags,
    author,
    sampleTests,
    constraints,
    testSolution } = req.body;

  if (!title || !description || !difficulty || !testSolution) {
    res.status(400).json({ error: 'Title, description, difficulty, and test solution are required' });
    return;
  }

  try {
    const newProblem = new Problem({
      title,
      description,
      difficulty,
      tags: tags || [],
    });

    await Problem.create(newProblem);
  } catch (error) {
    console.error('Error creating problem:', error);
    res.status(500).json({ error: 'Internal server error' });
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
    res.status(200).json(updatedProblem);
  } catch (error) {
    console.error('Error updating problem:', error);
    res.status(500).json({ error: 'Internal server error' });
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
      res.status(404).json({ error: 'Problem not found' });
      return;
    }
    res.status(200).json({ message: 'Problem deleted successfully' });
  } catch (error) {
    console.error('Error deleting problem:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
export const getProblemsByCount = async (req: Request, res: Response) => {
  try {
    const count = parseInt(req.query.count as string) || 10;
    const problems = await Problem.find().limit(count);
    res.status(200).json(problems);
    return;
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ error: 'Internal server error' });
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
  } catch (error) {
    console.error('Error fetching problem by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
}

export const getProblemsByUserId = async (req: Request, res: Response) => {
  const userId = req.query.userId;
  if (!userId) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }
  try {
    const problems = await Problem.find({ userId });
    res.status(200).json(problems);
  } catch (error) {
    console.error('Error fetching problems by user ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


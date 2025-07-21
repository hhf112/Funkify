import { Request, Response } from 'express';
import Problem from '../models/problemModels/Problem.js';
import { Error, MongooseError } from 'mongoose';
import { ObjectId } from 'mongoose';
import { Types } from 'mongoose';
import { ProblemType } from '../models/problemModels/Problem.js';
import SystemTests from '../models/submissionModels/SystemTests.js';
import { GoogleGenAI, Type } from '@google/genai';
import { getParsedCommandLineOfConfigFile } from 'typescript';

const ai = new GoogleGenAI({});

export const getSummary = async (req: Request, res: Response) => {
  const problemId = req.params.problemId;
  if (!problemId) {
    res.status(400).json({
      success: false,
      message: "problemId required.",
    })
    return;
  }

  try {
    const problem = await Problem.findById(problemId).exec();
    if (!problem) {
      res.status(404).json({
        success: false,
        message: "problem not found.",
      })
      return;
    }

    try {
      const summary = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite-preview-06-17",
        contents: `
        - backticks are used for inline code.
        - consider the code given below
         - ${problem.description}
         instructions:
         - provide a less technical translation of the problem statement.
         - exclude any hints on solving the problem
         - exlcude any ideas on solving the problem 
         - exlcude the solution to the problem
         - output format: 100 words.`,
        config: {
          thinkingConfig: {
            thinkingBudget: 0, // Disables thinking
          },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.STRING,
          },
        },

      });

      res.status(200).json({
        success: true,
        message: "summarized probelm success fully.",
        summary: summary?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}",
      })

    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Database error.",
    })
  }
}

export const createProblem = async (req: Request, res: Response) => {
  // console.log(req.body);
  const {
    difficulty,
    description,
    title,
    tags,
    sampleTests,
    hiddenTests,
    constraints,
    testSolution,
    linesPerTestCase,
    author,
  } = req.body;
  if (!difficulty || !description || !title || !tags ||
    !sampleTests || !constraints || !testSolution || !author || !hiddenTests) {
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
      linesPerTestCase,
    });


    const newTest = await SystemTests.create({
      problemId: newProblem._id,
      tested: false,
      tests: [...sampleTests, ...hiddenTests],
      author: author,
      linesPerTestCase: linesPerTestCase,
      runtime_s: newProblem.constraints?.runtime_s,
    })

    await Problem.findByIdAndUpdate(newProblem._id, { testId: newTest._id })

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


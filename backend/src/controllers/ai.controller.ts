import { Request, Response } from 'express';
import { Problem, type ProblemType } from '../models/problem.model.js';
import { GoogleGenAI, Type } from '@google/genai';
import { warn } from 'console';
import mongoose, { Mongoose } from 'mongoose';

const gemini = new GoogleGenAI({});

export const getSummary = async (req: Request, res: Response) => {
  const problemId = req.params.problemId;
  if (!problemId) {
    res.status(400).json({
      success: false,
      message: "problemId is required.",
    })
    return;
  }

  try {
    const problem_desc = await Problem.findById(problemId, "description").exec();
    if (!problem_desc) {
      res.status(404).json({
        success: false,
        message: "problem not found.",
      })
      return;
    }

    const get = await gemini.models.generateContent({
      model: "gemini-2.5-flash-lite-preview-06-17",
      contents: `CONTEXT:
        - Problem statement in markdown format:
        ${problem_desc}
        INSTRUCTIONS:
       - provide a less technical translation of the problem statement.
       - exclude any hints on solving the problem
       - exlcude any ideas on solving the problem 
       - exlcude the solution to the problem.
       - output format: 100 words. `,
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
      summary: get?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}",
    })

  } catch (err: any) {
    console.log(err);
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json({
        success: false,
        message: "Invalid problemId provided.",
      });
      return;
    }
    res.status(500).json({ message: "Internal server error", })
  }
}

export const getHint = async (req: Request, res: Response) => {
  const problemId = req.params.problemId;
  if (!problemId) {
    res.status(400).json({
      success: false,
      message: "problemId is required.",
    })
    return;
  }

  try {
    const problem = await Problem.findById(problemId, "description tags constraints").exec();
    if (!problem) {
      res.status(404).json({
        success: false,
        message: "problem not found.",
      })
      return;
    }

    const get = await gemini.models.generateContent({
      model: "gemini-2.5-flash-lite-preview-06-17",
      contents: `CONTEXT:
      - Problem statement in markdown format:
        ${problem.description}
      - Problem constraints:
         - maximum runtime in seconds: ${problem.constraints.runtime_s}
         - maximum memory in megabytes: ${problem.constraints.memory_mb}
      - Solution hints:
          - ${problem.tags.join(',')}

        INSTRUCTIONS:
       - provide a technical hint to solve the problem.
       - exclude the solution to the problem.
       - exclude any hints that completly solve the problem.
       - exclude any code.
       - output format: not more than 80 words.`,
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
      hint: get?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}",
    })

  } catch (err: any) {
    console.log(err);
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json({
        success: false,
        message: "Invalid problemId provided.",
      });
      return;
    }

    res.status(500).json({ message: "Internal server error", })
  }
}

export const getSolution = async (req: Request, res: Response) =>{
  const problemId = req.params.problemId;
  if (!problemId) {
    res.status(400).json({
      success: false,
      message: "problemId is required.",
    })
    return;
  }

  try {
    const problem = await Problem.findById(problemId, "description tags constraints").exec();
    if (!problem) {
      res.status(404).json({
        success: false,
        message: "problem not found.",
      })
      return;
    }

    const get = await gemini.models.generateContent({
      model: "gemini-2.5-flash-lite-preview-06-17",
      contents: `CONTEXT:
      - Problem statement in markdown format:
        ${problem.description}
      - Problem constraints:
         - maximum runtime in seconds: ${problem.constraints.runtime_s}
         - maximum memory in megabytes: ${problem.constraints.memory_mb}
      - Solution hints:
          - ${problem.tags.join(',')}

        INSTRUCTIONS:
       - write an optimized C++ snipped to solve the given problem.
       - include helpful ocmments to explain your working.
       - try to be as concise as possible.
       - output format: not more than 400 words.`,
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
      code: get?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}",
    })

  } catch (err: any) {
    console.log(err);
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json({
        success: false,
        message: "Invalid problemId provided.",
      });
      return;
    }

    res.status(500).json({ message: "Internal server error", })
  }
}

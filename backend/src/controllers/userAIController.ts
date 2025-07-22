import { Request, Response } from 'express';
import Problem from '../models/problemModels/Problem.js';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({});

const summarize = `instructions:
 - provide a less technical translation of the problem statement.
 - exclude any hints on solving the problem
 - exlcude any ideas on solving the problem 
 - exlcude the solution to the problem
 - output format: 100 words. `;


const hint = `
 instructions:
 - provide a technical hint to solve the problem
 - exlcude the solution to the problem
 - exclude  sharing any code
 - output format: 40 words.
`;

export const getSummary = async (req: Request, res: Response) => {
  const what = req.query.what as string;
  console.log(what);

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
        contents: `context
        ${problem.description}
        ` + (what === "summary" ? summarize : hint),
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

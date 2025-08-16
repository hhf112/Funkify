import { Request, Response } from 'express';
import {Problem, type ProblemType} from '../models/problem.model.js';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({});

const SUMMARIZE = `instructions:
 - provide a less technical translation of the problem statement.
 - exclude any hints on solving the problem
 - exlcude any ideas on solving the problem 
 - exlcude the solution to the problem.
 - output format: 100 words. `;


const HINT = `
 instructions:
 - provide a technical hint to solve the problem.
 - exlcude the solution to the problem.
 - exlcude any hints that completly solve the problem.
 - exclude  sharing any code.
 - output format: 40 words.
`;

// const SOLUTION = `
//  instructions: 
// - write a code solution in C++ for a solution to the problem statement.
// - write the solution formatted in a raw string.
// - format the code in plain text.
// - add very comprehensive and descriptive comments to explain the code.
//  - add an additional comment as a final summary of your approach where you also explain why this is correct.
// - output limit: 300 words. try to make it as simplistic and concise as possible.
 // `


export const getSummary = async (req: Request, res: Response) => {
  const what = parseInt(req.query.what as string);

  const problemId = req.params.problemId;
  if (!problemId) {
    res.status(400).json({ message: "problemId required.", })
    return;
  }

  try {
    const problem = await Problem.findById(problemId).exec();
    if (!problem) {
      res.status(404).json({ message: "problem not found.", })
      return;
    }

    try {
      let instructions: string;
      switch (what) {
        case 0:
          instructions = SUMMARIZE
          break;
        case 1:
          instructions = HINT
          break;
        // case 2:
        //   instructions = SOLUTION
        //   break;
        default:
          instructions = `
        - DO NOT perform any task
        - REPORT that you have not been provided any instructions
        `;
      }

      const summary = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite-preview-06-17",
        contents: `CONTEXT:
        - Problem statement in markdown format:
          ${problem.description}
        INSTRUCTIONS:
        ${instructions}`,

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
        message: "summarized probelm success fully.",
        summary: summary?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}",
      })

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error", })
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Database error.",
    })
  }
}

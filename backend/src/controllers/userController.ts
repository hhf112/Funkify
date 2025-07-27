import { Request, Response } from "express";
import User from "../models/userModels/User.js";
import type { UserType } from "../models/userModels/User.js";


export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    res.status(400).json({ message: "User id is required", });
    return;
  }
  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found", });
      return;
    }

    res.status(200).json({ message: "User found", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({

      message: "Database error",
    })
  }
}


export const updateAttempted = async (req: Request, res: Response) => {
  const { problemId, userId, status }: {
    problemId: string,
    userId: string,
    status: string,
  } = req.body;

  if (!problemId || !userId || !status) {
    res.status(400).json({ message: "required fields not provided." });
    return;
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "user not found." })
      return;
    }

    user.attempted.push({id: problemId, status: status});
    await user.save();

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" })
  }
}

export const getUserByEmail = async (req: Request, res: Response) => {
  const email = req.params.id;
  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User found", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({

      message: "Database error",
    })
  }
}

export const getProblemsSovled = async (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    res.status(400).json({ message: "User id is required" });
    return;
  }
  try {
    const user = await User.findById(userId).exec();

    if (user === null) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.status(200).json({ message: "User found", attempted: user.attempted, });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error.", })
  }
}

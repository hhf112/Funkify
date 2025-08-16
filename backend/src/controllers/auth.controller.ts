import express from 'express';
import monogoose from 'mongoose';
import bcrypt from "bcrypt"
import { User, UserType } from '../models/user.model.js';
import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser'
import "dotenv/config";
import { Request, Response } from 'express';


function generateAccessToken(user: {
  username: string,
  email: string
}) {
  return jwt.sign({
    username: user.username,
    email: user.email
  }, process.env.JWT_SECRET as string, { expiresIn: "4h" })
}

function generateRefreshToken(user: {
  username: string,
  email: string
}) {
  return jwt.sign({
    username: user.username,
    email: user.email
  }, process.env.REFRESH_SECRET as string)
}



export const loginHandler = async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({
      success: false,
      message: "email and password are required"
    });
    return;
  }

  let user = await User.findOne({ email: req.body.email }).exec();
  if (!user || user === null) {
    res.status(400).json({
      success: false,
      message: "user not found with this email"
    });
    return;
  }

  try {
    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) {
      res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
      return;
    }

    const access = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user = await User.findByIdAndUpdate(user._id, { jwt_refreshToken: refreshToken }, { new: true });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000  // 30 days
    })

    res.status(200).json({
      success: true,
      accessToken: access,
      refreshToken: refreshToken,
      user: user,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export const registerHandler = async (req: Request, res: Response) => {
  if (req.body.username == null || req.body.password == null || req.body.email == null) {
    res.status(400).json({
      success: false,
      message: "Username, password, and email are required"
    });
    return;
  }


  const hashingRounds = 12;
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, hashingRounds);
    const userResponse = {
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      jwt_refreshToken: null
    }

    await User.create(userResponse);

    res.status(200).json({
      success: true,
      user: userResponse,
    });

  } catch (err: any) {
    console.log(err);
    if (err.code === 11000) { // duplicate key error
      res.status(400).json({
        success: false,
        message: "Email already in use.",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
}

export const logoutHandler = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken == null) {
    res.status(400).json({
      success: false,
      message: "Refresh token must be provided"
    })
    return;
  }


  jwt.verify(refreshToken, process.env.REFRESH_SECRET as string, async (err: any, user: any) => {
    if (err) {
      res.status(401).json({
        success: false,
        message: "Invalid refresh token"
      });
      return;
    }

    try {
      const result = await User.findOne({ jwt_refreshToken: refreshToken }).exec();
      if (result == null) {
        res.status(401).json({
          success: false,
          message: "Invalid refresh token"
        })
        return;
      }

      await User.updateOne({ _id: result._id }, { jwt_refreshToken: null });
      res.clearCookie("refreshToken", {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      res
        .status(200).json({
          success: true,
        })

    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  })

}

export const tokenHandler = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken == null) {
    res.status(400).json({
      success: false,
      message: "Refresh token must be provided"
    })
    return;
  }


  jwt.verify(refreshToken, process.env.REFRESH_SECRET as string, async (err: any, user: any) => {
    if (err) {
      res.status(401).json({
        success: false,
        message: "Invalid refresh token"
      });
      return;
    }

    try {
      const result = await User.findOne({ jwt_refreshToken: refreshToken }).exec();
      if (result == null) {
         res.status(401).json({
          success: false,
          message: "Refresh token not found"
        })
        return;
      }

      const accessToken = generateAccessToken(result);

       res.status(200).json({
        success: true,
        accessToken: accessToken,
        user: result,
      });
    } catch (err) {
      console.error(err);
       res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  })
}

import express from 'express';
import monogoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/user_model.js';
import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser';


function generateAccessToken(user) {
  return jwt.sign({
    username: user.username,
    email: user.email
  }, process.env.JWT_SECRET, { expiresIn: "5h" })
}


export const loginHandler = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      success: false,
      message: "email and password are required"
    });
  }

  let user = await User.findOne({ email: req.body.email }).exec();
  if (user == null)
    return res.status(404).json({
      success: false,
      message: "user not found with this email"
    });

  user = user.toObject();
  try {
    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result)
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });

    const access = generateAccessToken(user);
    const refreshToken = jwt.sign({
      username: user.username,
      email: user.email,
    }, process.env.REFRESH_SECRET);
     await User.updateOne({ _id: user._id }, { jwt_refreshToken: refreshToken }, { new: true});
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000  // 30 days
    })

    return res.status(200).json({
      success: true,
      message: "Successfully logged in user",
      accessToken: access,
      user: user,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export const registerHandler = async (req, res) => {
  if (req.body.username == null || req.body.password == null || req.body.email == null) {
    return res.status(400).json({
      success: false,
      message: "Username, password, and email are required"
    });
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

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: userResponse,
    });

  } catch (err) {
    console.log(err);
    if (err.code === 11000) { // duplicate key error
      return res.status(500).json({
        success: false,
        message: "Email already in use.",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
}

export const logoutHandler = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken == null) {
    return res.status(400).json({
      success: false,
      message: "Refresh token must be provided"
    })
  }


  jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, user) => {
    if (err) return res.status(401).json({
      success: false,
      message: "Invalid refresh token"
    });

    try {
      const result = await User.findOne({ jwt_refreshToken: refreshToken }).exec();
      if (result == null) {
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token"
        })
      }

      await User.updateOne({ _id: result._id }, { jwt_refreshToken: null });
      res.clearCookie("refreshToken", {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      });

      return res
        .status(200).json({
          success: true,
          message: "User logged out successfully"
        })

    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  })

}

export const tokenHandler = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken == null)
    return res.status(400).json({
      success: false,
      message: "Refresh token must be provided"
    })


  jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, user) => {
    if (err) return res.status(401).json({
      success: false,
      message: "Invalid refresh token"
    });

    try {
      const result = await User.findOne({ jwt_refreshToken: refreshToken }).exec();
      if (result == null) {
        return res.status(401).json({
          success: false,
          message: "Refresh token not found"
        })
      }


      const accessToken = jwt.sign({
        username: result.username,
        email: result.email,
      }, process.env.JWT_SECRET);
      return res.status(200).json({
        success: true,
        message: "Access token generated successfully",
        accessToken: accessToken
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  })
}

export const modifyUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    })
  }

  const updationDetails = req.body.updationDetails;
  const userId = req.body.userId;
  if (!updationDetails) {
    return res.send(400).json({
      success: false,
      message: "Details not provied"
    });
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, user) => {
    if (err) return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });

    try {
      const updatedUser = await User.findOneAndUpdate(
        {_id: userId},
        updationDetails,
        { new: true });

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        })
      }
      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        problem: updatedUser,
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        error: error.name,
        message: error.message,
      });
      return;
    }
  })
}



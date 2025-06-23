import express from 'express';
import {
  logoutHandler,
  tokenHandler,
  loginHandler,
  registerHandler,
} from "../controllers/authController.js"

const auth = express.Router();

auth.delete("/logout", logoutHandler);
auth.get("/token", tokenHandler);
auth.get("/login", loginHandler);
auth.post("/register", registerHandler);

export default auth;

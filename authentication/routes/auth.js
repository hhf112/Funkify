import express from 'express';
import {
  logoutHandler,
  tokenHandler,
  loginHandler,
  registerHandler,
  modifyUser
} from "../controllers/authController.js"

const auth = express.Router();

auth.post("/logout", logoutHandler);
auth.get("/token", tokenHandler);
auth.post("/login", loginHandler);
auth.post("/register", registerHandler);
auth.post("/modify", modifyUser);

export default auth;

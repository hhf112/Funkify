import express from 'express';
import {
  logoutHandler,
  tokenHandler,
  loginHandler,
  registerHandler,
} from "../../controllers/auth.controller.js";

const router = express.Router();

router.post("/logout", logoutHandler);
router.post("/token", tokenHandler);
router.post("/login", loginHandler);
router.post("/register", registerHandler);

export default router;

import Router from "express";
import {
  getUserById,
  getUserByEmail,
  getProblemsSovled,
  updateAttempted
} from "../controllers/userController.js";

const router = Router();



router.get("/user/:id", getUserById);
router.get("/user/email/:email", getUserByEmail);
router.get("/user/problems/upd", updateAttempted);
router.get("/user/problems/:id", getProblemsSovled);

export default router;

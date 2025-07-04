import express, { Router } from "express";

import { addTests } from "../controllers/systemTestController.js";

const router = Router();

router.post("/", addTests);

export default router;



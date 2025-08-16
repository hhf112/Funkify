import express, { Router } from "express";

import { addTests } from "../../controllers/tests.controller.js";
import { Authenticate } from "../../middleware/authentication.js";

const router = Router();

router.use('/', Authenticate);

router.post("/", addTests);

export default router;



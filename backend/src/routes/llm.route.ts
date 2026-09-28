import express from "express";
import { handleAnalyze } from "../handlers/llm.handler.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/analyse", upload.single("resume"), handleAnalyze);


export default router;
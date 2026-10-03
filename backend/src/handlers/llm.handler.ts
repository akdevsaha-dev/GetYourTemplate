import type { Request, Response } from "express";
import { cargoBodyValidation, cargoFileValidation } from "../validations/validation.js";
import { extractTextFromPdf } from "../services/pdf.service.js";
import { returnColdEmail } from "../services/llm.service.js";

export const handleAnalyze = async (req: Request, res: Response) => {
  try {
    const bodyValidation = cargoBodyValidation.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        error: bodyValidation.error.issues[0]?.message || "Invalid request body",
      });
    }
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    const fileValidation = cargoBodyValidation.safeParse({
      mimetype: file.mimetype,
      size: file.size,
    });
    if (!fileValidation.success) {
      return res.status(400).json({
        error: fileValidation.error.issues[0]?.message || "Invalid file",
      });
    }

    const resumeText = await extractTextFromPdf(file.buffer, file.originalname);
    const coldEmail = await returnColdEmail(resumeText, bodyValidation.data);
    return res.json({
      success: true,
      message: "Resume uploaded and analyzed successfully",
      file: {
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
      },
      text: resumeText,
    });
  } catch (err: any) {
    console.error("handleAnalyze error:", err);
    return res.status(500).json({
      error: err.message || "Internal server error during analysis",
    });
  }
};

import type { Request, Response } from "express";
import {
  resumeBodyValidation,
  resumeFileValidation,
} from "../validations/validation.js";
import { PDFParse } from "pdf-parse";

export const handleAnalyze = async (req: Request, res: Response) => {
  try {
    const bodyValidation = resumeBodyValidation.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        error: bodyValidation.error.issues[0]?.message || "Invalid request body",
      });
    }
    const body = bodyValidation.data;

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        error: "Resume file is required",
      });
    }

    const fileValidation = resumeFileValidation.safeParse({
      mimetype: file.mimetype,
      size: file.size,
    });
    if (!fileValidation.success) {
      return res.status(400).json({
        error: fileValidation.error.issues[0]?.message || "Invalid file",
      });
    }

    let resumeText = "";
    try {
      const pdf = new PDFParse(new Uint8Array(file.buffer));
      const parsed = await pdf.getText();
      resumeText = parsed.text;
      await pdf.destroy();
    } catch (parseErr: any) {
      console.warn("Could not extract full text from PDF:", parseErr?.message);
      resumeText = `Extracted resume from ${file.originalname}`;
    }

    console.log("File received:", file.originalname, file.mimetype, `${Math.round(file.size / 1024)} KB`);
    console.log("Parameters:", body);
    console.log("================= Resume Content =================");
    console.log(resumeText.slice(0, 300) + (resumeText.length > 300 ? "..." : ""));

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

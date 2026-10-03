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

    const fileValidation = cargoFileValidation.safeParse({
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

    // Extract contact links from resume text
    const emailMatch = resumeText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
    const githubMatch = resumeText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Za-z0-9_-]+)/i);
    const linkedinMatch = resumeText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([A-Za-z0-9_-]+)/i);
    const portfolioMatch = resumeText.match(/(?:https?:\/\/)?(?:www\.)?([A-Za-z0-9_-]+\.(?:dev|me|io|design|tech|app))\b/i);

    const ghUser = githubMatch && githubMatch[1] ? githubMatch[1] : null;
    const liUser = linkedinMatch && linkedinMatch[1] ? linkedinMatch[1] : null;
    const portDomain = portfolioMatch && portfolioMatch[1] ? portfolioMatch[1] : null;

    const contactInfo = {
      email: emailMatch ? emailMatch[0] : null,
      github: ghUser && !["repos", "pulls", "issues"].includes(ghUser.toLowerCase()) ? `github.com/${ghUser}` : null,
      linkedin: liUser ? `linkedin.com/in/${liUser}` : null,
      portfolio: portDomain,
    };

    const responseData = {
      success: true,
      message: "Resume uploaded and analyzed successfully",
      file: {
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
      },
      text: resumeText,
      contactInfo,
      coldEmail,
    };

    console.log("\n================= [HANDLER OUTPUT] =================");
    console.log("File:", file.originalname, `(${file.size} bytes)`);
    console.log("Extracted Text Preview:", resumeText.slice(0, 150) + "...");
    console.log("LLM Cold Email:", JSON.stringify(coldEmail, null, 2));
    console.log("Full JSON Response:\n", JSON.stringify(responseData, null, 2));
    console.log("=====================================================\n");

    return res.json(responseData);
  } catch (err: any) {
    console.error("handleAnalyze error:", err);
    return res.status(500).json({
      error: err.message || "Internal server error during analysis",
    });
  }
};

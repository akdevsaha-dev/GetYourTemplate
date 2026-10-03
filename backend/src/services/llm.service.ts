import { coldEmailOutputSchema, type cargoBodyInput } from "../validations/validation.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

export const returnColdEmail = async (
  resumeText: string,
  options: cargoBodyInput,
) => {
  const { recipient, company, tone, recipientName } = options;

  const systemMessage = {
    role: "system" as const,
    content: `You are an elite career cold outreach strategist.
You write hyper-personalized, high-converting cold emails for tech roles.
Guidelines:
- Strict length: Between 75 to 90 words.
- Tone preset: ${tone}.
- Recipient perspective: Tailored specifically for a ${recipient} (e.g. Founders care about ROI & speed; Eng Leads care about technical depth & metrics; Recruiters care about role alignment).
- Never use generic clichés like "I hope this email finds you well" or "My name is...".
- Cite 1-2 concrete achievements directly from the candidate's resume.
- CRITICAL: Do NOT include a greeting/salutation (like "Hi ...") or sign-off/signature in the "body" field. Only output the pitch/proof paragraphs. The salutation and signature are rendered separately by the client.`,
  };


  const userMessage = {
    role: "user" as const,
    content: `Target Company & Role: ${company}
Target Recipient: ${recipient}${recipientName ? ` (Named: ${recipientName})` : ""}
Tone: ${tone}
Candidate Resume:
"""
${resumeText}
"""`,
  }

  try {
    const model = new ChatGoogleGenerativeAI({
      model: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
      temperature: 0.7,
    });
    const structuredModel = model.withStructuredOutput(coldEmailOutputSchema);
    const response = await structuredModel.invoke([systemMessage, userMessage]);
    return response;
  } catch (error: any) {
    console.error("[llm.service] Error generating cold email:", error?.message || error);
    throw new Error(error?.message || "Failed to generate cold email from AI service");
  }
};

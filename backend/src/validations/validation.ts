import * as z from "zod";

export const recipientEnum = [
  "founder",
  "eng_manager",
  "recruiter",
  "peer",
] as const;
export const toneEnum = ["punchy", "metric_heavy", "conversational"] as const;

export const cargoBodyValidation = z.object({
  recipient: z.enum(recipientEnum, {
    message: "Invalid recipient type",
  }),
  company: z
    .string()
    .trim()
    .min(1, "Company name cannot be empty")
    .max(200, "Company name is too long"),
  tone: z.enum(toneEnum, {
    message: "Invalid tone preset",
  }),
});

export const cargoFileValidation = z.object({
  mimetype: z.enum(["application/pdf"], {
    message: "Resume must be a PDF",
  }),
  // Align to 10MB or update frontend to 5MB
  size: z.number().max(10 * 1024 * 1024, "Resume must be smaller than 10MB"),
});

export type cargoBodyInput = z.infer<typeof cargoBodyValidation>
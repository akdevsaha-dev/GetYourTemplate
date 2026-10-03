import type { cargoBodyInput } from "../validations/validation.js";

export const returnColdEmail = (resumeText: string, options: cargoBodyInput) => {
    const { recipient, company, tone } = options;
    const systemPrompt = `
You are a professional cold email generator.
`

}
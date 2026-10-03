import { PDFParse } from "pdf-parse";

export async function extractTextFromPdf(
    buffer: Buffer,
    fallbackName: string
): Promise<string> {
    try {
        const pdf = new PDFParse(new Uint8Array(buffer));
        const parsed = await pdf.getText();
        await pdf.destroy();
        return parsed.text.trim();
    } catch (error: any) {
        console.warn(`[pdf.service] Could not extract text from ${fallbackName}:`, error?.message);
        return `Extracted resume from ${fallbackName}`;
    }
}

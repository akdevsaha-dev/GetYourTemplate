import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

export interface UploadedFileResponse {
  name: string;
  type: string;
  size: number;
}

export interface ColdEmailData {
  subject: string;
  body: string;
  closing?: string;
  [key: string]: unknown;
}

export interface CandidateContactInfo {
  name?: string | null;
  email?: string | null;
  github?: string | null;
  linkedin?: string | null;
  portfolio?: string | null;
  phone?: string | null;
  cvFileName?: string | null;
}

export interface AnalyzeResponse {
  success: boolean;
  message: string;
  file?: UploadedFileResponse;
  analysis?: Record<string, unknown>;
  text?: string;
  contactInfo?: CandidateContactInfo;
  coldEmail?: ColdEmailData;
  [key: string]: unknown;
}

export interface UploadOptions {
  recipient?: string;
  company?: string;
  tone?: string;
  recipientName?: string;
  onProgress?: (percent: number) => void;
}

/**
 * Uploads a resume file to the backend `/analyse` endpoint using axios.
 * Appends both "resume" and "file" fields for maximum compatibility.
 */
export async function uploadResume(
  file: File | Blob,
  fileName: string = "resume.pdf",
  options?: UploadOptions
): Promise<AnalyzeResponse> {
  const formData = new FormData();

  // If it's a raw File, use it directly. If Blob, provide the filename.
  if (file instanceof File) {
    formData.append("resume", file);
  } else {
    formData.append("resume", file, fileName);
  }

  if (options?.recipient) {
    formData.append("recipient", options.recipient);
  }
  if (options?.company) {
    formData.append("company", options.company);
  }
  if (options?.tone) {
    formData.append("tone", options.tone);
  }
  if (options?.recipientName) {
    formData.append("recipientName", options.recipientName);
  }

  const response = await apiClient.post<AnalyzeResponse>("/analyse", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && options?.onProgress) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        options.onProgress(percent);
      }
    },
  });

  return response.data;
}

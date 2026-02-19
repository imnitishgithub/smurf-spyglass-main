/**
 * API Service Layer
 * Handles all communication with the backend MuleCatcher server
 */

import type {
  Account,
  Ring,
  CaseRun,
  ValidationResult,
  GraphEdge,
} from "@/lib/types";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export interface AnalysisResponse {
  case: CaseRun;
  accounts: Account[];
  rings: Ring[];
  edges: GraphEdge[];
  validation?: ValidationResult;
  processingTime: number;
}

export interface ValidationResponse {
  valid: boolean;
  result: ValidationResult;
  errors?: string[];
}

/**
 * Validate CSV file before submission
 */
export async function validateCSV(file: File): Promise<ValidationResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/validate`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Validation failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Submit CSV file for analysis
 * Calls backend /analyze endpoint with multipart/form-data
 */
export async function analyzeCSV(file: File): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Analysis failed: ${response.statusText}`
    );
  }

  const data = await response.json();

  // Transform backend response to match frontend types if needed
  return {
    ...data,
    processingTime: data.processingTime || data.processing_time || 0,
  };
}

/**
 * Get detailed explanation for why an account was flagged
 */
export async function getAccountExplanation(
  caseId: string,
  accountId: string
): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/cases/${caseId}/accounts/${accountId}/explanation`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to get explanation: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.explanation || "";
}

/**
 * Get detailed explanation for why a ring was flagged
 */
export async function getRingExplanation(
  caseId: string,
  ringId: string
): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/cases/${caseId}/rings/${ringId}/explanation`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to get ring explanation: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.explanation || "";
}

/**
 * Export analysis results as JSON
 */
export async function exportAnalysisJSON(
  caseId: string
): Promise<AnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}/export`);

  if (!response.ok) {
    throw new Error(
      `Failed to export analysis: ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Get case history
 */
export async function getCaseHistory(): Promise<CaseRun[]> {
  const response = await fetch(`${API_BASE_URL}/cases`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch cases: ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Get specific case details
 */
export async function getCaseDetails(caseId: string): Promise<AnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch case: ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Health check endpoint
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}


export interface testResult {
  test: { input: string, output: string },
  output: string,
  verdict: VerdictResultType,
}
export interface Submission {
  problemId: string,
  userId: string,
  code: string,
  submissionTime?: Date,
  language: string
  status: string | "pending",
  verdictId: string | null,
}

export interface VerdictResultType {
  verdict: string,
  passed: boolean,
  error: {
    stderr: string,
    error: string,
  } | null,
}

export interface VerdictType {
  verdict: string,
  error?: {
    stderr: string,
    error: string,
  } | null
  results: VerdictResultType[],
  submissionId: string,
  userId: string,
  memory_mb: number,
  runtime_ms: number,
  testsPassed: number,
  totalTests: number,
}


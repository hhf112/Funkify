
export interface testResult {
  test: { input: string, output: string },
  output: string,
  verdict: VerdictResultType,
  error?: {
    stderr: string,
    error: string,
  }
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
    processed: boolean,
    fail: boolean,
    verdict: string,
    error?: {
      stderr: string,
      error: string,
    },
    results: boolean[],
    passed: number,
    total: number,
  }


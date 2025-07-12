import mongoose from 'mongoose';


export interface ResultType {
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
  results: ResultType[],
  submissionId: string,
  userId: string,
  memory_mb: number,
  runtime_ms: number,
  testsPassed: number,
  totalTests: number,
}

const verdictSchema = new mongoose.Schema({
  verdict: {
    type: String,
    enum: [
      'Accepted',
      'Wrong Answer',
      'Time Limit Exceeded',
      'Memory Limit Exceeded',
      'Runtime Error',
      'Compilation Error',
      'Skipped',
    ],
    required: true
  },
  results: {
    type: [{
      verdict: {
        type: String,
        required: true
      },
      passed: {
        type: Boolean,
        required: true
      },
      error: {
        type: {
          stderr: {
            type: String,
            required: true
          },
          error: {
            type: String,
            required: true
          }
        },
        default: null
      }
    }],
    required: true
  },
  error: {
    type: {
      stderr: String,
      error: String,
    },
    default: null
  },
  submissionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  userId: {
    type: String,
    required: true,
    trim: true
  },
  memory_mb: {
    type: Number,
    default: null,
  },
  runtime_ms: {
    type: Number,
    default: null,
  },
  testsPassed: {
    type: Number,
    required: true,
  },
  totalTests: {
    type: Number,
    required: true,
  }
})

const Verdict = mongoose.model('verdicts', verdictSchema);
export default Verdict;


import mongoose from 'mongoose';

export interface VerdictType {
  verdict: string,
  error?: string,
  stdout: string,
  stderr: string,
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
  error: {
    type: String,
    default: null
  },
  stdout: {
    type: String,
    default: null,
  },
  stderr: {
    type: String,
    default: null,
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


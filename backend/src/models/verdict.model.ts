import mongoose from 'mongoose';


export interface VerdictType {
  verdict: string;
  plagReportID: string;
  compile: boolean;
  runtime: boolean;
  submissionId: string;
  userId: string;
  memory_mb: number;
  runtime_s: number;
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

  plagReportID: {
    type: String,
    default: null,
  },
  compile: {
    type: Boolean,
    default: null,
    required: true
  },
  runtime: {
    type: Boolean,
    default: null,
    required: true
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
  runtime_s: {
    type: Number,
    default: null,
  },
})

export const Verdict = mongoose.model('verdicts', verdictSchema);

import mongoose from 'mongoose';

export interface SubmissionType {
  problemId: string,
  testId: string
  userId: string,
  code: string,
  lang: string,
  status: {
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
}

const submissionSchema = new mongoose.Schema({
  problemId: {
    type: String,
    required: true,
    trim: true
  },
  testId: {
    type: String,
    default: null,
  },
  userId: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true
  },
  lang: {
    type: String,
    required: true,
  },
  status: {
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
      type: Object,
      default: null,

      stderr: {
        type: String,
        default: null
      },
      error: {
        type: String,
        default: null
      }
    },
    results: {
      type: [Boolean],
      default: []
    },
    passed: {
      type: Number,
      required: true,
    },
    processed: {
      type: Boolean,
      required: true,
      default: false
    },
    fail: {
      type: Boolean,
      required: true,
      default: false
    },
    total: {
      type: Number,
      required: true,
    }
  },
},
  { timestamps: true }
)

const Submission = mongoose.model('submissions', submissionSchema);
export default Submission;

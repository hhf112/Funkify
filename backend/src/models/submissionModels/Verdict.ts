import mongoose from 'mongoose';

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

  errorMessage: {
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
  runtime_s: {
    type: Number,
    default: null,
  },
})

const Verdict = mongoose.model('verdicts', verdictSchema);
export default Verdict;

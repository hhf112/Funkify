import mongoose from 'mongoose';

export interface SubmissionType {
  problemId: string,
  userId: string,
  code: string,
  language: string,
  submissionTime: Date,
  status: string,
  verdictId: string,
  constraints: {
    runtime_s: Number,
    memory_mb: Number,
  }
}

const submissionSchema = new mongoose.Schema({
  problemId: {
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
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
  },
  submissionTime: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Processed"],
    default: 'Pending'
  },
  constraints: {
    runtime_s: Number,
    memory_mb: Number,
  },
  verdictId: {
    type: String,
    default: null
  },
})

const Submission = mongoose.model('submissions', submissionSchema);
export default Submission;

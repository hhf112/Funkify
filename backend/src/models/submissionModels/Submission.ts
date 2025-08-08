import mongoose from 'mongoose';


export interface SubmissionType {
  problemId: string,
  testId: string,
  userId: string,
  code: string,
  language: string,
  submissionTime?: Date,
  status?: string,
  verdictId?: string,
}


const submissionsSchema = new mongoose.Schema({
  testId: {
    type: String,
    required: true,
  },
  problemId: {
    type: String,
    required: true,
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
  submissionTime: {
    type: String,
    default: () => new Date().toLocaleString()
  },
  language: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "processing", "processed", "fail"],
    default: 'pending'
  },
  verdictId: {
    type: String,
    default: null
  },
})

const Submissions = mongoose.model('submissions', submissionsSchema);
export default Submissions;

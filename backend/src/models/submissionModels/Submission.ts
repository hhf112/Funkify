import mongoose from 'mongoose';

const submissionsSchema = new mongoose.Schema({
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
    type: Date,
    default: Date.now
  },
  language: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "processing", "processed"],
    default: 'Pending'
  },
  verdictId: {
    type: String,
    default: null
  },
})

const Submissions = mongoose.model('submissions', submissionsSchema);
export default Submissions;

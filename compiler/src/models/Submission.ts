import mongoose from 'mongoose';

const submissionsSchema = new mongoose.Schema({
  ProblemId: {
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
  submissionTime: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Processed"],
    default: 'Pending'
  },
  verdictId: {
    type: String,
    default: null
  },
})

const Submissions = mongoose.model('submissions', submissionsSchema);
export default Submissions;

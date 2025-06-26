import mongoose from 'mongoose';

const systemTestsSchema = new mongoose.Schema({
  ProblemId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  tests: {
    type: [{
      input: {
        type: String,
        required: true
      },
      output: {
        type: String,
        required: true
      }
    }],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  author: {
    type: String,
    required: true,
  },
})

const SystemTests = mongoose.model('systests', systemTestsSchema);
export default SystemTests;

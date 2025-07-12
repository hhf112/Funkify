import mongoose from 'mongoose';

export interface SystemTestsType {
  problemId: string,
  tested?: boolean,
  tests: {
    input: string,
    output: string,
  }[],
  createdAt?: Date,
  author: string,
  linesPerTestCase: number,
  runtime_s: number,
}

const systemTestsSchema = new mongoose.Schema({
  linesPerTestCase: {
      type: Number,
      required: true,
  },
  problemId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  tested: {
    type: Boolean,
    default: false,
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
  runtime_s: {
    type: Number,
    required: true,
  },
})

const SystemTests = mongoose.model('systests', systemTestsSchema);
export default SystemTests;

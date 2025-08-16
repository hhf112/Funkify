import mongoose from 'mongoose';

export interface ProblemType {
  createdAt?: Date,
  author: string | null,
  title: string,
  description: string,
  difficulty: string,
  tags: string[],
  sampleTests: {
    input: string,
    output: string,
  }[],
  hiddenTests: {
    input: string,
    output: string,
  }
  constraints: {
    runtime_s: number,
    memory_mb: number,
  },
  testSolution: string,
  testLines: number
}

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  author: {
    type: String,
    default: null,
  },
  sampleTests: {
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
  hiddenTests: {
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
  constraints: {
    type: Object,
    required: true,
    runtime_s: {
      type: Number,
      default: 2
    },
    memory_mb: {
      type: Number,
      default: 256
    },
  },
  testId: {
    type: String,
    default: null,
  },
  testSolution: {
    type: String,
    required: true,
    trim: true
  },
  testLines: {
    type: Number,
    required: true,
    default: 1,
  }
})

export const Problem = mongoose.model('problems', problemSchema);

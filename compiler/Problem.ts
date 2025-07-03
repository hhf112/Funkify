import mongoose from 'mongoose';

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
    default: 'Anonymous'
  },
  userId: {
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
  constraints: {
    runtime_s: {
      type: Number,
      default: 2
    },
    memory_mb: {
      type: Number,
      default: 256
    }
  },
  testSolution: {
    type: String,
    required: true,
    trim: true
  },
  linesPerTestCase: {
    type: Number,
    required: true,
    default: 1,
  }
})

const Problem = mongoose.model('problems', problemSchema);
export default Problem;

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
    default: 'Anonymous'
  },
  userId: {
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
  constraints: {
    runtime_s: {
      type: Number,
      default: 2
    },
    memory_mb: {
      type: Number,
      default: 256
    }
  },
  testSolution: {
    type: String,
    required: true,
    trim: true
  },
  linesPerTestCase: {
    type: Number,
    required: true,
    default: 1,
  }
})

const Problem = mongoose.model('problems', problemSchema);
export default Problem;

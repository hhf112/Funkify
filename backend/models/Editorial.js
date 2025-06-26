import mongoose from 'mongoose';

const EditorialSchema = new mongoose.Schema({
  mdText: {
    type: String,
    required: true,
    trim: true
  },
  solution: {
    type: {
      code: String,
      language: String,
    },
    required: true,
  },
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  commentIDs: [String],
})

const Editorial = mongoose.model('editorals', EditorialSchema);
export default Editorial;

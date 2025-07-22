
import mongoose from 'mongoose';

export interface UserType {
  username: string,
  password: string,
  problemsSovled: string[],
  email: string,
}
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    default: [],
  },
  problemsSolved: {
    type: [String],
    default: [],
  },
  email: {
    type: String,
    required: true,
  },
})

const User = mongoose.model('user', userSchema);
export default User;  


import mongoose from 'mongoose';

export interface UserType {
  username: string,
  password: string,
  attempted: {
    id: string,
    status: string,
  }[],
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
  attempted: {
    type: [{
      id: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      }
    }],
    default: [],
  },
  email: {
    type: String,
    required: true,
  },
})

const User = mongoose.model('user', userSchema);
export default User;  

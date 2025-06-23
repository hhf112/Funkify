import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

  jwt_refreshToken: {
    type: String,
    required: false,
  }
},
  {
    timestamps: true,
  }
)

const User = mongoose.model('user', userSchema);
export default User;


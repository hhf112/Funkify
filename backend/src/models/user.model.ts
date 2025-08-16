import mongoose from 'mongoose';

export interface UserType {
  username: string,
  password: string,
  email: string,
  createdAt?: Date,
  updatedAt?: Date,
  jwt_refreshToken?: string,
}

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
  jwt_refreshToken: {
    type: String,
    required: false,
  }
},
  {
    timestamps: true,
  }
)

export const User = mongoose.model('user', userSchema);


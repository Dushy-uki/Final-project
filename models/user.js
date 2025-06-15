// models/user.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, unique: true, required: true },

  password: { type: String, required: true },

  refreshToken: {
  type: String,
  default: ''
},


  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },

  // Optional Profile Info
  bio: { type: String },
  avatar: { type: String }, // store URL to avatar or image path
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);

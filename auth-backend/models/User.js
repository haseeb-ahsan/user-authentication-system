import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Number },
  preferredLanguages: { type: String, default: '' },
});

const User = mongoose.model('User', userSchema);

export default User;

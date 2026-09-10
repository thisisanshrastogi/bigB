import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  }
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default Admin;

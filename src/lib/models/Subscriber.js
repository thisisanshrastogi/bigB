import mongoose from 'mongoose';

const { Schema } = mongoose;

const SubscriberSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true,
  },
  status: { 
    type: String, 
    enum: ['subscribed', 'unsubscribed'], 
    default: 'subscribed' 
  },
}, { timestamps: true });

export default mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema);

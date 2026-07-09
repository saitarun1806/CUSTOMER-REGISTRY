import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['Assignment', 'StatusUpdate', 'NewMessage', 'SystemAlert'],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    relatedComplaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
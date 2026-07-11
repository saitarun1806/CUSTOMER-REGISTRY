import Notification from '../models/Notification.js';
import mongoose from 'mongoose';

const getNotifications = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
            return res.status(200).json([]);
        }
        const notifications = await Notification.find({ recipient: req.user._id })
        .populate('relatedComplaint', 'title status')
        .sort({createdAt:-1});

        res.status(200).json(notifications);
    }catch(err){
        res.status(500).json({ message: "Failed to fetch notifications", error: err.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const  notification = await Notification.findById(req.params.id);
        if(!notification){
            return res.status(404).json({ message: "Notification not found" });
        }
        if(notification.recipient.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: "You are not authorized to mark this notification as read" });
        }
        notification.isRead = true;
        await notification.save();
        res.status(200).json(notification);
    }catch(err){
        res.status(500).json({ message: "Failed to mark notification as read", error: err.message });
    }
};

export { getNotifications, markAsRead };
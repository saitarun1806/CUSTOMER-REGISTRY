import Message from '../models/Message.js';
import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';

const addMessage = async (req, res) => {
    try {
        const {text} = req.body;
        const {complaintId} = req.params;

        if(!text){
            return res.status(400).json({ message: "Please provide a message" });
        }
        const complaint = await Complaint.findById(complaintId);
        if(!complaint){
            return res.status(404).json({ message: "Complaint not found" });
        }
        const message = await Message.create({
            complaintId,
            sender: req.user._id,
            content: text
        });
        const recipientId = req.user.role === 'customer' ? complaint.assignedAgent : complaint.customer;
        if(recipientId){
            await Notification.create({
                recipient: recipientId, 
                message: `New message on complaint: ${complaint.title}`,
                type: 'Message', 
                relatedComplaint: complaintId,
            });
        
        }
        res.status(201).json(message);
    }catch(err){
        res.status(500).json({ message: "Failed to send message", error: err.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const {complaintId} = req.params;
        const messages = await Message.find({complaintId})
        .populate('sender', 'fullName role')
        .sort({ createdAt: 1 });
        res.status(200).json(messages);
    }catch(err){
        res.status(500).json({ message: "Failed to fetch messages", error: err.message });
    }
};

export { addMessage, getMessages };
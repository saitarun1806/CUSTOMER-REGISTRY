import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js'; // Fixed typo: Notifcation -> Notification
import User from '../models/User.js';

const createComplaint = async (req, res) => {
    try {
        const { title, description, type } = req.body;

        const complaint = await Complaint.create({
            customer: req.user._id,
            title,
            description,
            type,
        });
        res.status(201).json(complaint);
    } catch (err) {
        res.status(400).json({ message: "Failed to create complaint", error: err.message });
    }
};

const getComplaints = async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            const complaints = await Complaint.find()
                .populate('customer', 'fullName email') // Fixed typo: eamil -> email
                .populate('assignedAgent', 'fullName email')
                .sort({ createdAt: -1 });
            res.status(200).json(complaints);
        }
        else if (req.user.role === 'agent') {
            const complaints = await Complaint.find({ assignedAgent: req.user._id })
                .populate('customer', 'fullName email')
                .populate('assignedAgent', 'fullName email')
                .sort({ createdAt: -1 });
            res.status(200).json(complaints);
        }
        else {
            const complaints = await Complaint.find({ customer: req.user._id })
                .populate('assignedAgent', 'fullName')
                .sort({ createdAt: -1 });
            res.status(200).json(complaints);
        }
    } catch (err) {
        res.status(500).json({ message: "Server error fetching complaints", error: err.message });
    }
};

const assignAgent = async (req, res) => {
    try {
        const { agentId } = req.body;
        const complaint = await Complaint.findById(req.params.id);
        
        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }
        
        // Fixed bug: assignAgent -> assignedAgent (Must match your database schema exactly!)
        complaint.assignedAgent = agentId;
        complaint.status = 'In Progress';
        await complaint.save();

        // 1. Notify the Agent (Added required 'type' field!)
        await Notification.create({
            recipient: agentId,
            type: 'Assignment', // <--- This prevents the validation crash!
            message: `You have been assigned a new complaint: ${complaint.title}`,
            relatedComplaint: complaint._id,
        });

        // 2. Notify the Customer (So they know someone is working on their ticket!)
        await Notification.create({
            recipient: complaint.customer,
            type: 'Status Update',
            message: `Your complaint "${complaint.title}" has been assigned to an agent and is In Progress.`,
            relatedComplaint: complaint._id,
        });

        res.status(200).json({ message: "Agent assigned successfully", complaint });
    } catch (err) {
        res.status(500).json({ message: "Failed to assign agent", error: err.message });
    }
};

const updateComplaintStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const complaint = await Complaint.findById(req.params.id);
        
        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }
        
        complaint.status = status;
        await complaint.save();
        
        await Notification.create({
            recipient: complaint.customer,
            type: 'Status Update',
            message: `Your complaint "${complaint.title}" status has been updated to "${status}"`,
            relatedComplaint: complaint._id,
        });
        
        res.status(200).json({ complaint });
    } catch (err) {
        res.status(500).json({ message: "Failed to update complaint status", error: err.message });
    }
};

const escalateComplaint = async (req, res) => {
    try {
        const { reason } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        complaint.isEscalated = true;
        complaint.escalationReason = reason || '';
        await complaint.save();

        const admins = await User.find({ role: 'admin' }).select('_id');
        await Promise.all(admins.map((admin) => Notification.create({
            recipient: admin._id,
            type: 'Escalation',
            message: `Complaint "${complaint.title}" was escalated${reason ? `: ${reason}` : ''}`,
            relatedComplaint: complaint._id,
        })));

        res.status(200).json({ message: "Complaint escalated", complaint });
    } catch (err) {
        res.status(500).json({ message: "Failed to escalate complaint", error: err.message });
    }
};

const getComplaintsByStatus = async (req, res) => {
    try {
        const { status } = req.params;

        const complaints = await Complaint.find({ status: status })
            .populate('customer', 'fullName email')
            .populate('assignedAgent', 'fullName email')
            .sort({ createdAt: -1 });
            
        res.status(200).json({
            count: complaints.length,
            currentFilter: status,
            complaints: complaints,
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch complaints by status", error: err.message });
    }
};

// Note: Ensure your route file imports 'assignAgent' (not assignComplaint) to match this export!
export { createComplaint, getComplaints, assignAgent, updateComplaintStatus, escalateComplaint, getComplaintsByStatus };
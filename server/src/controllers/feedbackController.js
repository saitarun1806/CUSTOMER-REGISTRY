import Feedback from '../models/Feedback.js';
import Complaint from '../models/Complaint.js';


const submitFeedback = async (req, res) => {
    try {
        const { rating, comments } = req.body;
        const { complaintId } = req.params;

        const complaint = await Complaint.findById(complaintId);
        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }
        if (complaint.status !== 'Resolved' && complaint.status !== 'Closed') {
            return res.status(400).json({
                message: `Feedback rejected. You can only rate complaints that are Resolved or Closed. Current status is: ${complaint.status}`
            });
        }
        if (complaint.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to submit feedback for this complaint" });
        }

        const existingFeedback = await Feedback.findOne({ complaintId });
        if (existingFeedback) {
            return res.status(400).json({ message: "Feedback already submitted for this complaint" });
        }
        const feedback = await Feedback.create({
            complaintId,
            customer: req.user._id,
            agent: complaint.assignedAgent,
            rating,
            comments
        });
        res.status(201).json(feedback);
    } catch (err) {
        res.status(500).json({ message: "Failed to submit feedback", error: err.message });
    }
};

const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('customer', 'fullName email')
            .populate('agent', 'fullName email')
            .populate('complaintId', 'title status');
        res.status(200).json(feedbacks);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch feedbacks", error: err.message });
    }
};

const getFeedbackByComplaintId = async (req, res) => {
    try {
        const { complaintId } = req.params;
        const feedback = await Feedback.findOne({ complaintId })
            .populate('customer', 'fullName email')
            .populate('agent', 'fullName email')
            .populate('complaintId', 'title status');
        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch feedback", error: err.message });
    }
};


const getFeedbackByAgent = async (req, res) => {
    try {
        const { agentId } = req.params;
        const feedbacks = await Feedback.find({ agent: agentId })
            .populate('customer', 'fullName email')
            .populate('complaintId', 'title type status')
            .sort({ createdAt: -1 });

        if (!feedbacks || feedbacks.length === 0) {
            return res.status(200).json({
                totalReviews: 0,
                averageRating: 0,
                feedbacks: []
            });
        }

        const totalReviews = feedbacks.length;
        const sumRatings = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
        const averageRating = (sumRatings / totalReviews).toFixed(1);

        res.status(200).json({
            agentId,
            totalReviews,
            averageRating,
            feedbacks
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch feedbacks", error: err.message });
    }
};

export { submitFeedback, getAllFeedback, getFeedbackByComplaintId, getFeedbackByAgent };
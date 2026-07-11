import express from "express";

import { submitFeedback, getAllFeedback, getFeedbackByComplaintId, getFeedbackByAgent } from "../controllers/feedbackController.js";
import { auth, adminOnly, agentOrAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/:complaintId', auth, submitFeedback);
router.get('/agent/:agentId', auth, agentOrAdmin, getFeedbackByAgent);   
router.get('/:complaintId', auth, getFeedbackByComplaintId);
router.get('/', auth, adminOnly, getAllFeedback);

export default router;
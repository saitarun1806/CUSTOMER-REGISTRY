import express from 'express';

import {createComplaint, getComplaints,assignAgent, updateComplaintStatus,getComplaintsByStatus} from '../controllers/complaintController.js';
import {auth,adminOnly,agentOrAdmin} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', auth, createComplaint);
router.get('/', auth, getComplaints);
router.put('/:id/assign', auth, adminOnly, assignAgent);
router.put('/:id/status', auth, agentOrAdmin, updateComplaintStatus);
router.get('/status/:status', auth,adminOnly, getComplaintsByStatus);

export default router;
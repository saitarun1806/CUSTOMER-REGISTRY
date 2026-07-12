import express from 'express';

import {createComplaint, getComplaints,assignAgent, updateComplaintStatus,escalateComplaint,getComplaintsByStatus, getCustomerHistory} from '../controllers/complaintController.js';
import {auth,adminOnly,agentOrAdmin} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', auth, createComplaint);
router.get('/', auth, getComplaints);
router.put('/:id/assign', auth, adminOnly, assignAgent);
router.put('/:id/status', auth, agentOrAdmin, updateComplaintStatus);
router.put('/:id/escalate', auth, agentOrAdmin, escalateComplaint);
router.get('/status/:status', auth,adminOnly, getComplaintsByStatus);
router.get('/customer/:customerId', auth, agentOrAdmin, getCustomerHistory);

export default router;
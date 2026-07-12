import express from 'express';
import { registerUser, loginUser,createAgent,getAgent, updateProfile } from '../controllers/authController.js';

import { auth,adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.post('/agent',auth,adminOnly, createAgent);
router.get('/agents',auth,adminOnly, getAgent);
router.put('/profile', auth, updateProfile);
export default router;
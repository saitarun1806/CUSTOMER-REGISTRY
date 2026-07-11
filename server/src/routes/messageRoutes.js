import express from "express";

import {addMessage, getMessages} from "../controllers/messageController.js";
import {auth} from "../middleware/authMiddleware.js";

const router = express.Router();


router.post('/:complaintId', auth, addMessage);
router.get('/:complaintId', auth, getMessages);

export default router;
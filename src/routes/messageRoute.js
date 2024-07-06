import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getConversations, getMessage, sendMessage } from "../controllers/messageController.js";
const router  = express.Router()

router.post('/:recepientId', protectRoute, sendMessage)
router.get('/conversations', protectRoute, getConversations)
router.get('/:conversationId/messages', protectRoute, getMessage);

router.post('/messages/:recipientId', protectRoute, sendMessage);


export default router;
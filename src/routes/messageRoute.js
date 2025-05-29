import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getConversations, getMessage, sendMessage } from "../controllers/messageController.js";
import { startConversation } from "../controllers/conversationController.js";
const router  = express.Router()

router.get('/:start', protectRoute, startConversation)

router.post('/:recepientId', protectRoute, sendMessage)
router.get('/conversations', protectRoute, getConversations)
router.get('/:conversationId/messages', protectRoute, getMessage);

router.post('/messages/:recipientId', protectRoute, sendMessage);


export default router;
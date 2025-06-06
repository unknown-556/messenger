import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getConversations, getMessage, sendMessage, sendMessageToConversation } from "../controllers/messageController.js";

const router  = express.Router()

// router.get('/:start', protectRoute, startConversation)

router.post('/:recipientId', protectRoute, sendMessage)
router.post('/:conversationId', protectRoute, sendMessageToConversation)
router.get('/conversations', protectRoute, getConversations)
router.get('/:conversationId/messages', protectRoute, getMessage);

// router.post('/:recipientId', protectRoute, sendMessage);


export default router;
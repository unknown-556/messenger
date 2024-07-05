import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getConversations, getMessage, sendMessage } from "../controllers/messageController.js";
const router  = express.Router()

router.post('/:recepientId', protectRoute, sendMessage)
router.get('/conversations', protectRoute, getConversations)
router.get('/:conversationId/messages', protectRoute, getMessage);


export default router;
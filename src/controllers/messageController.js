import mongoose from "mongoose";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { recipientId } = req.params;
        console.log(recipientId)
        const { message } = req.body;
        console.log(message)
        const senderId = req.user._id;

        // Validate message
        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message cannot be empty' });
        }

        // Validate recipient ID
        if (!mongoose.Types.ObjectId.isValid(recipientId)) {
            return res.status(400).json({ error: 'Invalid recipient ID' });
        }

        // Find or create conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] },
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, recipientId],
                lastMessage: {
                    text: message,
                    sender: senderId,
                    seen: false,
                },
                messages: [] // initialize messages array
            });
            await conversation.save();
        }

        // Create and save message
        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text: message,
        });

        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                $set: {
                    lastMessage: {
                        text: message,
                        sender: senderId,
                        seen: false,
                    },
                },
                $push: { messages: newMessage._id },
            }),
        ]);

        // Send real-time update via socket
        const recipientSocketId = getRecipientSocketId(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('newMessage', newMessage);
        }

        // Respond
        res.status(200).json({
            message: newMessage,
            conversationId: conversation._id,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const sendMessageToConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { message } = req.body;
        const senderId = req.user._id;

        // Validate input
        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message cannot be empty' });
        }

        // Find conversation and validate user is a participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        if (!conversation.participants.includes(senderId)) {
            return res.status(403).json({ error: 'You are not a participant in this conversation' });
        }

        // Create and save the message
        const newMessage = new Message({
            conversationId,
            sender: senderId,
            text: message,
        });

        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                $set: {
                    lastMessage: {
                        text: message,
                        sender: senderId,
                        seen: false,
                    },
                }
            }),
        ]);

        // Emit socket event to other participant
        const recipientId = conversation.participants.find(
            (p) => p.toString() !== senderId.toString()
        );
        const recipientSocketId = getRecipientSocketId(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('newMessage', newMessage);
        }

        res.status(200).json({
            message: newMessage,
            conversationId,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};



export const getConversations = async (req, res) => {
    const userId = req.user._id;

    try {
        const conversations = await Conversation.find({ participants: userId })
            .sort({ updatedAt: -1 })
            .populate({
                path: 'participants',
                select: 'username profilePic'
            })
            .lean();

        const filteredConversations = conversations.map((conversation) => {
            const otherParticipants = conversation.participants.filter(
                (participant) => participant._id.toString() !== userId.toString()
            );
            return {
                ...conversation,
                participants: otherParticipants
            };
        });

        res.status(200).json(filteredConversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
};




export const getMessage = async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.user._id;

    try {
        // Fetch the conversation to get participants
        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        // Ensure user is part of the conversation
        if (!conversation.participants.includes(userId)) {
            return res.status(403).json({ error: 'Not authorized to view these messages' });
        }

        // Fetch all messages in this conversation
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

        // Mark other participant’s messages as seen
        await Message.updateMany({
            conversationId,
            sender: { $ne: userId },
            isSeen: false,
        }, {
            isSeen: true
        });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
};


export const deleteMessage = () => {}
export const updateMessage = () => {}
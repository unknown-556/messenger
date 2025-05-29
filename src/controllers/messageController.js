import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { recipientId } = req.params;
        const { message } = req.body;
        const senderId = req.user._id;

        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message cannot be empty' });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] },
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, recipientId],
                lastMessage: {
                    text: message,
                    sender: senderId,
                },
            });
            await conversation.save();
        }

        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text: message,
        });

        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage: {
                    text: message,
                    sender: senderId,
                },
            }),
        ]);

        const recipientSocketId = getRecipientSocketId(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('newMessage', newMessage);
        }

        res.status(200).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
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
        console.log('Conversation ID:', conversationId);
        console.log('User ID:', userId);

        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

        console.log('Messages:', messages);

        if (messages.length > 0 && messages[0].conversationId && messages[0].conversationId.participants) {
            const recipientId = messages[0].conversationId.participants.find(id => id.toString() !== userId.toString());

            console.log('Recipient ID:', recipientId);

            if (recipientId && recipientId.toString() === userId.toString()) {
                await Message.updateMany({ conversationId, sender: { $ne: userId }, isSeen: false }, { isSeen: true });
            }
        }

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log({ error: error.message }, error);
    }
};


export const deleteMessage = () => {}
export const updateMessage = () => {}
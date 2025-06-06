// import Conversation from '../models/conversationModel.js';

// export const startConversation = async (req, res) => {
//     const { recipientId } = req.body;
//     const senderId = req.user._id;

//     if (!recipientId || recipientId === senderId.toString()) {
//         return res.status(400).json({ error: 'Invalid recipient ID' });
//     }

//     try {
//         let conversation = await Conversation.findOne({
//             participants: { $all: [senderId, recipientId] }
//         });

//         if (!conversation) {
//             conversation = new Conversation({
//                 participants: [senderId, recipientId]
//             });
//             await conversation.save();
//         }

//         res.status(200).json(conversation);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

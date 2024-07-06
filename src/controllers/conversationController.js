// import Conversation from '../models/conversationModel.js';

// export const startConversation = async (req, res) => {
//     const { recipientId } = req.body;
//     const senderId = req.user._id;

//     try {
//         let conversation = await Conversation.findOne({
//             participants: { $all: [senderId, recipientId] }
//         });

//         if (!conversation) {
//             conversation = new Conversation({
//                 participants: [senderId, recipientId],
//                 lastMessage: {
//                     text: '',
//                     sender: senderId
//                 }
//             });
//             await conversation.save();
//         }

//         res.status(200).json(conversation);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

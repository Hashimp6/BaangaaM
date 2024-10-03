const socketIo = require("socket.io");
const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");
const shopModel = require("../models/shopModel");

function setupSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', async ({ userId, opponentId }) => {
      const conversationId = [userId, opponentId].sort().join("-");
      socket.join(conversationId);
      console.log("joined to ", conversationId);

      try {
        let conversation = await Conversation.findOne({ conversationId })
          .populate('participants.participantId','name email')
          .populate('messages.sender','name')
          .sort({ 'messages.timestamp': -1 })
          .limit(50)
          .lean();

        if (!conversation) {
          const [user, opponent] = await Promise.all([
            User.findById(userId),
            shopModel.findById(opponentId)
          ]);

          const userModel = 'User';
          const opponentModel = 'Shop';

          conversation = new Conversation({
            conversationId,
            participants: [
              { participantId: user._id, participantModel: userModel },
              { participantId: opponent._id, participantModel: opponentModel }
            ],
            messages: []
          });
          await conversation.save();

          // Populate the participants after saving
         
        }

        const messages = conversation.messages.map(msg => ({
          ...msg,
          sender: msg.sender._id.toString(),
          senderName: msg.sender.name
        }));

        const participantsInfo = conversation.participants.map(p => ({
          _id: p.participantId._id.toString(),
          name: p.participantId.name,
          model: p.participantModel
        }));

        socket.emit('loadMessages', { messages, participants: participantsInfo });

        await Conversation.updateMany(
          { conversationId, 'messages.sender': { $ne: userId }, 'messages.read': false },
          { $set: { 'messages.$[].read': true } }
        );
      } catch (error) {
        console.error('Error in joinRoom:', error);
        socket.emit('error', 'Failed to load messages');
      }
    });

    socket.on('sendMessage', async ({ userId, opponentId, message }) => {
      const conversationId = [userId, opponentId].sort().join("-");
      
      try {
        let conversation = await Conversation.findOne({ conversationId });

        if (!conversation) {
          throw new Error('Conversation not found');
        }

        const sender = await User.findById(userId);
        const newMessage = {
          sender: userId,
          senderModel: 'User',
          message,
          timestamp: new Date(),
          read: false
        };

        conversation.messages.push(newMessage);
        conversation.lastActivity = new Date();
        await conversation.save();

        io.to(conversationId).emit('receiveMessage', newMessage);
      } catch (error) {
        console.error('Error in sendMessage:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    socket.on('markAsRead', async ({ userId, opponentId, messageId }) => {
      const conversationId = [userId, opponentId].sort().join("-");
      
      try {
        await Conversation.updateOne(
          { conversationId, 'messages._id': messageId },
          { $set: { 'messages.$.read': true } }
        );
      } catch (error) {
        console.error('Error in markAsRead:', error);
        socket.emit('error', 'Failed to mark message as read');
      }
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
}

module.exports = setupSocket;
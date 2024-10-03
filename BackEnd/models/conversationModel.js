const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, refPath: 'senderModel', required: true },
  senderModel: { type: String, required: true, enum: ['User', 'Shop'] },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});


const participantSchema = new mongoose.Schema({
  participantId: { type: mongoose.Schema.Types.ObjectId, refPath: 'participantModel' }, // Add refPath here
  participantModel: { type: String, enum: ['User', 'Shop'] }  // Dynamic reference
}, { _id: false });

const conversationSchema = new mongoose.Schema({
  conversationId: { type: String, required: true, unique: true },
  participants: [participantSchema],
  messages: [messageSchema],
  lastActivity: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conversation', conversationSchema);
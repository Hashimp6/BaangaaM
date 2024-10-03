const { mongoose } = require("mongoose");
const Conversation = require("../models/conversationModel"); // Assuming you stored your Conversation model here
const userModel = require("../models/userModel");
const shopModel = require("../models/shopModel");

const findConversations = async (req, res) => {
  const { userId } = req.body;

  try {
    // Step 1: Find all conversations where the user is a participant
    const conversations = await Conversation.find({
      "participants.participantId": userId,
    }).lean(); // Lean is used for better performance

    if (!conversations || conversations.length === 0) {
      return res.json({ success: true, message: "No conversations yet" });
    }

    // Step 2: Process and populate participants dynamically
    const processedConversations = await Promise.all(
      conversations.map(async (conv) => {
        console.log("conv is ", conv);
        // Populate each participant dynamically based on participantType
        const populatedParticipants = await Promise.all(
          conv.participants.map(async (participant) => {
            if (participant.participantModel === "User") {
              const user = await userModel.findById(
                participant.participantId,
                "name email"
              );
              return { ...participant, name: user?.name, email: user?.email };
            } else if (participant.participantModel === "Shop") {
              const shop = await shopModel.findById(
                participant.participantId,
                "shopName email"
              );
              console.log("Shop document: ", shop);
              return {
                ...participant,
                name: shop?.shopName,
                email: shop?.email,
              };
            }
          })
        );
        console.log("fromm innn", populatedParticipants);
        // Finding the other participant (besides the requesting user)
        const otherParticipant = populatedParticipants.find(
          (p) => String(p.participantId) !== String(userId)
        );

        // Retrieve the last message
        const lastMessage =
          conv.messages.length > 0
            ? conv.messages[conv.messages.length - 1]
            : null;

        return {
          _id: conv._id,
          conversationId: conv.conversationId || conv._id,
          otherParticipantId: otherParticipant
            ? otherParticipant.participantId
            : null,
          otherParticipantName: otherParticipant
            ? otherParticipant.name
            : "Unknown",
          otherParticipantType: otherParticipant
            ? otherParticipant.participantModel
            : null,
          messageCount: conv.messages.length,
          lastMessage: lastMessage ? lastMessage.text : "No messages yet",

          lastActivity: conv.lastActivity || null,
        };
      })
    );
    console.log("from outttt", processedConversations);
    // Step 3: Send the response back
    return res.json({ success: true, data: processedConversations });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const conversation = async (req, res) => {
  const { userId, storeId } = req.body;
  console.log(userId, storeId);
  try {
    const conversations = await Conversation.find({
      participants: { $all: [userId, storeId] },
    }).populate("participants", "email"); // Populate participant details

    if (conversations.length === 0) {
      console.log("no conversagtion");
      return res.json({ success: false, message: "No conversation found" });
    } else {
      console.log(conversations);
      return res.json({ success: true, data: conversations });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { findConversations, conversation };

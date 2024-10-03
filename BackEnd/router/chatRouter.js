const express= require('express')
const findConversations = require('../components/chatComponent')
const chatRouter= express.Router()

chatRouter.post('/all_chats',findConversations.findConversations)
chatRouter.post('/conversation',findConversations.conversation)

module.exports=chatRouter
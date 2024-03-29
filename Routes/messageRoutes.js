// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const {
  createMessage,
  deltedMessage,
  getMessagesChat,
  messageUpdate,
} = require("../controllers/messageController");

router.post("/createMessage/:id", createMessage);
router.delete("/deleteMessage/:id", deltedMessage);
router.get("/messagesChatId/:id", getMessagesChat);   ///get messages 
router.patch("/updateMessage/:id", messageUpdate);

module.exports = router;

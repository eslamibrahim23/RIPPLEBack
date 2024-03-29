const mongoose = require("mongoose");
const { Users } = require("../models/userSchema");
const { Chats } = require("../models/chatSchema");

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Messages = mongoose.model(`message`, messageSchema);

module.exports = { Messages };

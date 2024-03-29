const mongoose = require("mongoose");
const { Users } = require("../models/userSchema");
const { string } = require("joi");

const chatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    groupChat: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      default: null,
    },

    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

const Chats = mongoose.model(`chat`, chatSchema);
module.exports = { Chats };

const { Messages } = require("../models/messageSchema");
const { Chats } = require("../models/chatSchema");

// hena create message in chat or in group!
const createMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const chatId = id;
    const { sender, content } = req.body;

    const chat = await Chats.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    if (chat.groupChat) {
      const message = await Messages.create({
        chatId,
        sender,
        content,
      });
      return res.status(201).json(message);
    } else {
      const message = await Messages.create({
        chatId,
        sender,
        content,
      });
      return res.status(201).json(message);
    }
  } catch (error) {
    console.error("Error creating message:", error);
    return res
      .status(500)
      .json({ message: "Error creating message", error: error.message });
  }
};
/////hene get message by chatId/    hena hnget all messages in one chat
const getMessagesChat = async (req, res) => {
  try {
    console.log("jhsd");
    const { id } = req.params;
    const chatId = id;
    const messages = await Messages.find({ chatId })
      .populate({
        path: "sender",
        select: "userName Image", // Select the name and image fields from the sender
        populate: {
          path: "Image", // Assuming there's an 'image' field in the user schema
          select: "url", // Select the URL field of the image
        },
      })
      .sort({ createdAt: 1 })
      .select("content createdAt sender");

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

////// hena hn33mml update ll message by contant
const messageUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const messageUpdated = await Messages.findByIdAndUpdate(id, { content });
    res.status(200).json("You updated the message");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

///// delete message
const deltedMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const Message = await Messages.findByIdAndDelete(id);
    if (!Message) {
      res.status(500).json("the message not found");
    }
    res.status(201).json("You are deleted this message");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMessage,
  deltedMessage,
  getMessagesChat,
  messageUpdate,
};

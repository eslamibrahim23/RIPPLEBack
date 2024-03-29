// routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const { Chats } = require("../models/chatSchema");
const {
  createChat,

  getChatTwoUser,
  chatDeleted,
  createGroup,
  getAllGroups,
  getChat,
  chatsForUserLogedIn,
} = require("../controllers/chatController");
// Route to create a new chat
router.post("/newchat", createChat); //hena creat new chat
router.get("/chatTwoUsers/:userId1/:userId2", getChatTwoUser); //hena get all chats to one user
router.post("/getorCreateChat/:id", getChat); /// hena get chat or create in one endpoint
router.delete("/deleteChat/:id", chatDeleted); //delete el chat or group
router.post("/creategroup/:id", createGroup); /// craate el group
router.get("/getAllgroupsUser/:id", getAllGroups); //get all groups to one user => user login
router.get("/chatsForUserLogedIn/:userId", chatsForUserLogedIn);
module.exports = router;

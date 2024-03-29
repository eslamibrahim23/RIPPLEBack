const { Chats } = require("../models/chatSchema");
const { Messages } = require("../models/messageSchema");
/////new update hena get or create in one endpoint
const getChat = async (req, res, next) => {
  const { userId } = req.body;
  const { id } = req.params; // the sender in "in local storage"
  const users = [id, userId].sort();
  let chat = await Chats.findOne({
    users: {
      $size: 2,
      $all: users,
    },
  });

  if (chat) {
    res.status(200).json(chat);
  } else {
    const newChat = new Chats({
      users,
      name: "sender", // front end handel it
    });

    const savedChat = await newChat.save();

    const getChat = await Chats.findById(savedChat._id).populate(
      "users",
      "-Password"
    );

    if (!getChat) {
      return next(new BadRequest("The chat not found", 400));
    }

    res.status(201).json(getChat);
  }
};

////////////

// Create a new chat    //hena creat in endpoint
const createChat = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;

    const newChat = new Chats({
      users: [userId1, userId2],
    });
    await newChat.save();

    res.status(201).json({ message: "Chat created successfully" });
  } catch (error) {
    console.log("Error occurred while creating chat:", error);
    res.status(500).json({ error: error.message });
  }
};

/// hena get user between 2 user
const getChatTwoUser = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    console.log(userId1, userId2);

    const chats = await Chats.find({
      users: { $elemMatch: { $eq: userId1, $eq: userId2 } },
    }).populate("users", "userName Image Bio Email");

    console.log("Chats found:", chats);

    res.status(200).json(chats);
  } catch (error) {
    console.log("Error occurred while fetching chats:", error);
    res.status(500).json({ error: error.message });
  }
};
/////////////// hena get all chats for user to loggin
// const chatsForUserLogedIn = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const chats = await Chats.find({ users: userId }).populate(
//       "users",
//       "userName Image"
//     );
//     console.log("Chat object:", chats);
//     const processedChats = await Promise.all(
//       chats.map(async (chat) => {
//         const receiver = chat.users.find(
//           (user) => user._id.toString() !== userId
//         );
//         console.log("Chats:", chats);
//         console.log("Processed Chats:", processedChats);

//         const lastMessage = await Messages.findOne({ chatId: chat._id })
//           .sort({ createdAt: -1 })
//           .select("content");

//         return {
//           _id: chat._id,
//           receiver: {
//             _id: receiver._id,
//             userName: receiver.userName,
//             Image: receiver.Image,
//           },
//           lastMessage: lastMessage ? lastMessage.content : null,
//         };
//       })
//     );

//     res.status(200).json(processedChats);
//   } catch (error) {
//     console.log("Error occurred while fetching chats:", error);
//     res.status(500).json({ error: error.message });
//   }
// };
// const chatsForUserLogedIn = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Apply pagination: Limit the number of chats returned per page
//     const PAGE_SIZE = 10; // Adjust the page size as needed
//     const page = req.query.page ? parseInt(req.query.page) : 1;
//     const skip = (page - 1) * PAGE_SIZE;

//     // Modify the query to use efficient indexing and limit the data returned
//     const chats = await Chats.find({ users: userId })
//       .populate("users", "userName Image")
//       .skip(skip)
//       .limit(PAGE_SIZE);

//     console.log("Fetched chats:", chats);

//     const processedChats = chats.map(async (chat) => {
//       // Find receiver and last message for each chat
//       const receiver = chat.users.find(
//         (user) => user._id.toString() !== userId
//       );

//       if (!receiver) {
//         console.log("Receiver not found for chat:", chat);
//         return null; // Skip processing if receiver is not found
//       }

//       const lastMessage = await Messages.findOne({ chatId: chat._id })
//         .sort({ createdAt: -1 })
//         .select("content");

//       return {
//         _id: chat._id,
//         receiver: {
//           _id: receiver._id,
//           userName: receiver.userName,
//           Image: receiver.Image,
//         },
//         lastMessage: lastMessage ? lastMessage.content : null,
//       };
//     });

//     // Wait for all processed chats to resolve
//     const result = await Promise.all(processedChats);

//     // Filter out null values (chats with no receiver)
//     const filteredChats = result.filter((chat) => chat !== null);

//     res.status(200).json(filteredChats);
//   } catch (error) {
//     console.log("Error occurred while fetching chats:", error);
//     res.status(500).json({ error: error.message });
//   }
// };
const chatsForUserLogedIn = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chats.find({ users: userId }).populate(
      "users",
      "userName Image"
    );

    console.log("Fetched chats:", chats);

    const processedChats = chats.map(async (chat) => {
      const receiver = chat.users.find(
        (user) => user._id.toString() !== userId
      );

      if (!receiver) {
        console.log("Receiver not found for chat:", chat);
        return null;
      }

      const lastMessage = await Messages.findOne({ chatId: chat._id })
        .sort({ createdAt: -1 })
        .select("content");

      return {
        _id: chat._id,
        receiver: {
          _id: receiver._id,
          userName: receiver.userName,
          Image: receiver.Image,
        },
        lastMessage: lastMessage ? lastMessage.content : null,
      };
    });

    const result = await Promise.all(processedChats);

    const filteredChats = result.filter((chat) => chat !== null);

    res.status(200).json(filteredChats);
  } catch (error) {
    console.log("Error occurred while fetching chats:", error);
    res.status(500).json({ error: error.message });
  }
};

//hena b2q delete chat group or chat
const chatDeleted = async (req, res) => {
  try {
    const { id } = req.params;
    const chatDeleted = await Chats.findByIdAndDelete(id);
    if (!chatDeleted) {
      res.status(404).json("Sorry but this chat not found");
    }
    res.status(200).json("You deleted this chat Now");
  } catch (error) {
    console.log("y samah 7sl kda error f deleted el chat");
    res.status(500).json({ error: error.message });
  }
};
///////////////// here part of grouChat
const createGroup = async (req, res) => {
  try {
    const { groupName, users } = req.body;
    const groupAdmin = req.params.id;
    const newGroup = new Chats({
      users,
      groupName,
      groupAdmin,
      groupAdmin,
      groupChat: true,
    });
    await newGroup.save();
    res.status(200).json(newGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
/////// getAllGroups to the user
const getAllGroups = async (req, res) => {
  try {
    const { id } = req.params;
    const myGroups = await Chats.find({
      $or: [{ members: { $in: [id] } }, { groupAdmin: id }],
      groupChat: true,
    })
      .populate("groupAdmin", "userName Image Bio Email")
      .populate("members", "userName Bio Image Email");

    res.status(200).json(myGroups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createChat,
  getChatTwoUser,
  chatDeleted,
  createGroup,
  getAllGroups,
  getChat,
  chatsForUserLogedIn,
};

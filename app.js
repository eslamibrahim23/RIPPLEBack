const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();
const connect = require("./dataBase/connectToDB");
const authRoute = require("./Routes/authRoute");
const userRoute = require("./Routes/userRoutes");
const cors = require("cors");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const { Chats } = require("./models/chatSchema");
const { Messages } = require("./models/messageSchema");
const path = require("path");
const app = express();
const server = http.createServer(app, { log: false, origins: "*:*" });
const io = socketIo(server, {
  cors: { origin: "http://localhost:5173" },
  methods: ["GET", "POST"],
});
app.use(express.json());
// app.use(cors());
app.use(cors());
app.use("/", authRoute);

//// image
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
app.post("/upload", (req, res) => {
  const contentType = req.headers["content-type"];
  if (!contentType || !contentType.includes("multipart/form-data")) {
    return res.status(400).json({ error: "Invalid Content-Type header" });
  }
});

////
app.use("/user", userRoute);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);
const PORT = process.env.PORT || 3000;
const URL = process.env.URL_DATABASE;
console.log(process.env.URL_DATABASE);


io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  //my last result as old vers
  // socket.on("send_message", (message) => {
  //   console.log("Received message from client:", message);
  //   // Broadcast the message to all connected clients
  //   io.emit("receive_message", message);

  //new test to join room
  socket.on("join_room", (data) => {
    socket.join(data);
  });
  socket.on("send_message", (message) => {
    // Broadcast the message to chatId
    socket.to(message.chatId).emit("receive_message", message);
  });


  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

console.log("hrloo");
connect(
  "mongodb+srv://eslamibrahem111:35PnaPCvuWKkIoAm@cluster0.zyht7s4.mongodb.net/ripplBACK"
);
console.log(PORT);

server.listen(7000, () => {
  console.log(`Server is running on port http://localhost:7000/ `);
});

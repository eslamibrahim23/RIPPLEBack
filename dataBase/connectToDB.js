const mongoose = require("mongoose");
function connect(URL) {
  mongoose
    .connect(URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("sorry can not connected DB:", err));
}

module.exports = connect;

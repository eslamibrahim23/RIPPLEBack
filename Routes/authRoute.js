const express = require("express");
const authroutes = express.Router();
const { login, signup } = require("../controllers/authController");

authroutes.get("/", (req, res, next) => {
  res.json({ message: "helloooooo" });
});
authroutes.post("/signup", signup);
authroutes.post("/login", login);

module.exports = authroutes;

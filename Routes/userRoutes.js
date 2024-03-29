const express = require("express");
const userroutes = express.Router();
const {
  getalluser,
  getuserbyid,
  deleteProfile,
  edituserProfile,
} = require("../controllers/userControllers");
const upload = require("../Middleware/upload");
userroutes.get("/profile/:id", getuserbyid); //profile
userroutes.get("/users", getalluser);

userroutes.delete("/deleteProfile/:id", deleteProfile); //delete
userroutes.patch("/editprofile/:id", upload.single("Image"), edituserProfile);
module.exports = userroutes;

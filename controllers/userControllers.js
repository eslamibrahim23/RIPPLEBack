const { Users } = require("../models/userSchema");
const { Chats } = require("../models/chatSchema");
const { Userschema, updatedUserschema } = require("../Utlis/UserValidation");
const bcrypt = require("bcrypt");
//show profile here

getuserbyid = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found or not an user" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
  next();
};
//// user edit profile
edituserProfile = async (req, res, next) => {
  const iD = req.params.id;
  const editprofile = req.body;
  if (req.file) {
    editprofile.Image = req.file
      ? req.file.path
      : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";
  }

  try {
    const validated = updatedUserschema.validate(editprofile);

    if (validated.error) {
      throw validated.error;
    }
    if (req.body.Password && req.body.Password.trim() !== "") {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.Password, saltRounds);
      editprofile.Password = hashedPassword;
    }
    const newedit = await Users.findByIdAndUpdate(iD, editprofile);
    console.log(editprofile.role);
    if (!editprofile) {
      return res.status(404).json({ message: "user not found or not user" });
    }

    res.status(200).json({ message: "user updated succesful " });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
  next();
};

/////show all users
getalluser = async (req, res, next) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    console.log("San not to fetch users", error);
    res.status(500).json({ error: "Can not fetch all users" });
  }
};

//delete account
deleteProfile = async (req, res) => {
  const iD = req.params.id;

  try {
    await Users.findByIdAndDelete(iD);
    console.log(iD);
    res.json({ message: "you deleted your account" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  getalluser,

  deleteProfile,
  edituserProfile,
  getuserbyid,
};

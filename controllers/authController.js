const { Users } = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Userschema, loginschema } = require("../Utlis/UserValidation");
signup = async (req, res, next) => {
  try {
    const { userName, Email, Password } = req.body;

    const validated = Userschema.validate(req.body);
    if (validated.error) {
      throw validated.error;
    }

    const emailcheck = await Users.findOne({ Email }).exec();
    if (emailcheck) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    const newUser = await Users.create({
      userName,
      Email,
      Password: hashedPassword,
    });

    console.log("User added successfully:", newUser);
    res.status(201).json({ message: "User added successfully", newUser });
  } catch (error) {
    console.error("Error adding user:", error);
    res
      .status(500)
      .json({ message: "Error adding user", error: error.message });
  }
};

const login = async (req, res, next) => {
  try {
    ///check mail
    var validated = loginschema.validate(req.body);
    if (validated.error) {
      return res.status(400).json({ message: validated.error.message });
    }
    var user = await Users.findOne({ Email: req.body.Email });
    if (!user) return res.status(400).send("Invalid email or password");
    ///check pass
    var passwordCheck = await bcrypt.compare(req.body.Password, user.Password);
    if (!passwordCheck)
      return res.status(400).send("Invalid email or password");

    ////token here
    var token = jwt.sign({ userID: user._id }, "secret-key", {
      expiresIn: "30d",
    });
    res.header("x-auth-token", token);
    console.log(token);
    res.cookie("jwtToken", token, { httpOnly: true });
    res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { signup, login };

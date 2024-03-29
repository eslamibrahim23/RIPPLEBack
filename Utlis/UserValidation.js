const Joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const JoiPassword = Joi.extend(joiPasswordExtendCore);

const Userschema = Joi.object({
  userName: Joi.string().min(3).required(),
  Bio: Joi.string(),
  Phone: Joi.string(),
  Image: Joi.string(),
  Address: Joi.string(),
  Email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  Password: JoiPassword.string()
    .min(8)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .required(),
  cPassword: JoiPassword.string()
    .valid(Joi.ref("Password"))
    .messages({ "any.only": "Confirm password must match password" }),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});

const loginschema = Joi.object({
  Email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  Password: JoiPassword.string()
    .min(8)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .required(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});
const updatedUserschema = Joi.object({
  userName: Joi.string().min(3),
  Bio: Joi.string().allow(``),
  Phone: Joi.number(),
  Image: Joi.string().allow(""),
  Address: Joi?.string(),
  Email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  Password: JoiPassword.string()
    .min(8)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1),
  cPassword: JoiPassword.string()
    .valid(Joi.ref("Password"))
    .messages({ "any.only": "Confirm password must match password" }),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});
module.exports = { Userschema, loginschema, updatedUserschema };

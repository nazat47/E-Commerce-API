const { StatusCodes } = require("http-status-codes");
const User = require("../models/users");
const { NotFound, BadRequest, Unauthenticated } = require("../errors");

const userRegister = async (req, res) => {
    const userData = await User.create(req.body);
    if (!userData) {
      return res.status(StatusCodes.BAD_REQUEST).send("Can not create user");
    }
    res.status(StatusCodes.OK).json({ userData });
  };
  const userLogin = async (req, res) => {
    const { email, passwordHash } = req.body;
    if (!email || !passwordHash) {
      throw new BadRequest("Please insert email and password");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Unauthenticated("Invalid credentials");
    }
    const passMatched = await user.comparePassword(passwordHash);
    if (!passMatched) {
      throw new Unauthenticated("Invalid credentials");
    }
    const token = await user.createToken();
    res.status(StatusCodes.OK).json({ user, token });
  };
  module.exports = {
    userRegister,
    userLogin
  };
  
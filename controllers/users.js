const { StatusCodes } = require("http-status-codes");
const User = require("../models/users");
const { NotFound, BadRequest, Unauthenticated } = require("../errors");

const GetAllUsers = async (req, res) => {
  const users = await User.find({}).select("name phone email");
  res.status(StatusCodes.OK).json({ users });
};
const GetUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select(
    "-passwordHash",
  );
  if (!user) {
    throw new NotFound(`No user found with id ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const getUsersCount = async (req, res) => {
  const countUser = await User.countDocuments();
  res.status(StatusCodes.OK).json({ Total_Users: countUser });
};
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const del = await User.findOneAndDelete({ _id: id });
  if (!del) {
    throw new NotFound(`No User found with id ${id}`);
  }
  res.status(StatusCodes.OK).send("User Deleted");
};
module.exports = {
  GetAllUsers,
  deleteUser,
  GetUser,
  getUsersCount,
};

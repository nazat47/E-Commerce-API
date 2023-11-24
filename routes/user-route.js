const express = require("express");
const {
  GetAllUsers,
  GetUser,
  getUsersCount,
  deleteUser,
} = require("../controllers/users");
const router = express.Router();

router.route("/").get(GetAllUsers)
router.route("/:id").get(GetUser).delete(deleteUser);
router.route("/count").get(getUsersCount);

module.exports = router;

const express = require("express");
const { userRegister, userLogin } = require("../controllers/auth");

const router = express.Router();

router.route("/login").post(userLogin);
router.route("/register").post(userRegister)

module.exports = router;

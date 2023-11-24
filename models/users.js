const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: false,
  },
  street: {
    type: String,
    default: "",
  },
  apartment: {
    type: String,
    default: "",
  },
  zip: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
});
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
userSchema.set("toJSON", {
  virtuals: true,
});
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(this.passwordHash, salt);
  this.passwordHash = hashedPass;
});
userSchema.methods.createToken = function () {
  return jwt.sign(
    {
      userId: this._id,
      name: this.name,
      isAdmin:this.isAdmin
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10d",
    },
  );
};
userSchema.methods.comparePassword = async function (candidatePass) {
  const isMatch = await bcrypt.compare(candidatePass, this.passwordHash);
  return isMatch;
};
module.exports = mongoose.model("User", userSchema);

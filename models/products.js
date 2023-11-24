const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  richDescription: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  images: [
    {
      type: String,
    },
  ],
  brand: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  categorie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categorie",
    required: true,
  },
  inStock: {
    type: Number,
    required: true,
    min: 0,
    max: 300,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numberReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});
// productSchema.virtual("id").get(function () {
//   return this._id.toHexString();
// });
// productSchema.set("toJSON", {
//   virtuals: true,
// });
module.exports = mongoose.model("Products", productSchema);

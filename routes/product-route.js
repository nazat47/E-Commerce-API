const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  deleteProduct,
  getProduct,
  updateProduct,
  getProductsCount,
  getFeaturedProducts,
  uploadOptions,
  updateProductGallery,
} = require("../controllers/products");
router.route("/").get(getAllProducts);
router.post('/',uploadOptions.single('image'),createProduct)
router.route("/:id").get(getProduct).delete(deleteProduct).patch(updateProduct);
router.route('/get/count').get(getProductsCount)
router.route('/get/featured/:count').get(getFeaturedProducts)
router.patch('/get/imageGallery/:id',uploadOptions.array('images',10),updateProductGallery)
module.exports = router;

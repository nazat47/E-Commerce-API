const express = require("express");
const {
  getAllCategories,
  createCategory,
  deleteCategory,
  getCategory,
  updateCategory,
} = require("../controllers/categories");
const router = express.Router();

router.route("/").get(getAllCategories).post(createCategory);
router.route('/:id').delete(deleteCategory).get(getCategory).patch(updateCategory)
module.exports = router;

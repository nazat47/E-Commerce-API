const express = require("express");
const {
  getAllOrders,
  createOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  totalSales,
  getOrderCount,
  getUserOrders,
} = require("../controllers/orders");
const router = express.Router();

router.route("/").get(getAllOrders).post(createOrders);
router.route("/:id").get(getOrder).patch(updateOrder).delete(deleteOrder);
router.route('/get/totalsales').get(totalSales)
router.route('/get/count').get(getOrderCount)
router.route('/userorders/:userid').get(getUserOrders)

module.exports = router;

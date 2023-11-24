const { StatusCodes } = require("http-status-codes");
const Order = require("../models/orders");
const OrderItem = require("../models/order-item");
const { NotFound, BadRequest } = require("../errors");

const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "name phone")
    .sort({ dateOrdered: -1 });
  res.status(StatusCodes.OK).json({ orders });
};
const getOrder = async (req, res) => {
  const orders = await Order.findById(req.params.id)
    .populate("user", "name phone")
    .populate({
      path: 'orderItems',
      populate: { path: 'product' }
    });
  res.status(StatusCodes.OK).json({ orders });
};
const getUserOrders = async (req, res) => {
  const userorders = await Order.find({user:req.params.userid})
    .populate("orderItems")
    .sort({ dateOrdered: -1 });
  res.status(StatusCodes.OK).json({ userorders });
};
const createOrders = async (req, res) => {
  const orderItemsId = Promise.all(
    req.body.orderItems.map(async (item) => {
      let newOrderItem = await OrderItem.create(item);
      return newOrderItem._id;
    }),
  );
  const orderItemsResolved = await orderItemsId;
  const totalPrices = await Promise.all(
    orderItemsResolved.map(async (item) => {
      const orderitem = await OrderItem.findOne({ _id: item }).populate(
        "product",
      );
      const total = orderitem.product.price * orderitem.quantity;
      return Number(total);
    }),
  );
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
  const orders = await Order.create({
    ...req.body,
    orderItems: orderItemsResolved,
    totalPrice: totalPrice,
  });
  res.status(StatusCodes.OK).json(orders);
};
const updateOrder = async (req, res) => {
  const {
    params: { id },
  } = req;
  const orderId = await Order.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!orderId) {
    throw new NotFound(`No order found with id ${id}`);
  }
  res.status(StatusCodes.OK).json(orderId);
};
const deleteOrder = async (req, res) => {
  const { id } = req.params;
  const delOrder = await Order.findOneAndDelete({ _id: id });
  if (!delOrder) {
    throw new NotFound(`No order found with id ${id}`);
  }
  await delOrder.orderItems.map(async (item) => {
    await OrderItem.findOneAndDelete({ _id: item });
  });
  res.status(StatusCodes.OK).send("Order deleted");
};
const totalSales = async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);
  if(!totalSales){
    throw new BadRequest("The order sales cant be calculated")
  }
  res.status(StatusCodes.OK).json({totalSales})

};
const getOrderCount = async (req, res) => {
  const countOrder = await Order.countDocuments();
  res.status(StatusCodes.OK).json({ Total_Orders: countOrder });
};
module.exports = {
  getAllOrders,
  createOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  totalSales,
  getOrderCount,
  getUserOrders,
};

const express = require("express");
const router = express.Router();
const {
  seedOrders,
  getOrdersByUserId,
  addNewOrder,
  getOrdersByMerchantId,
  updateOrderById,
  deleteOrderById,
} = require("../controllers/ordersController");

router.get("/orders/seed", seedOrders);

// User routes for orders
router.post("/orders", getOrdersByUserId); // get user's orders sorted in date descending order
router.put("/orders", addNewOrder); // check out user's cart/create new orders by user

// Merchant routes for orders
router.post("/orders/manage", getOrdersByMerchantId); // get all orders for merchant
router.patch("/orders/manage", updateOrderById); // merchant to confirm collection of user order
router.delete("/orders/manage", deleteOrderById); // delete order

module.exports = router;

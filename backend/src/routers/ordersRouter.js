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
const { authUser, authMerchant } = require("../middleware/auth");

router.get("/orders/seed", seedOrders);

// User routes for orders
router.post("/orders", authUser, getOrdersByUserId); // get user's orders sorted in date descending order
router.put("/orders", authUser, addNewOrder); // check out user's cart/create new orders by user

// Merchant routes for orders
router.post("/orders/manage", authMerchant, getOrdersByMerchantId); // get all orders for merchant
router.patch("/orders/manage", authMerchant, updateOrderById); // merchant to confirm collection of user order
router.delete("/orders/manage", authMerchant, deleteOrderById); // delete order

module.exports = router;

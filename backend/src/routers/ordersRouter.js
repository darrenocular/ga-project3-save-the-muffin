const express = require("express");
const router = express.Router();
const {
  getOrdersByUserId,
  addNewOrder,
  getOrdersByMerchantId,
  updateOrderById,
  deleteOrderById,
} = require("../controllers/ordersController");
const {
  validateFetchUserOrders,
  validateUserCollected,
  validateBodyId,
  validateBodyMerchant,
} = require("../validators/ordersValidator");
const {
  authCartOwner,
  authMerchantOrderOwner,
  authUserOrderOwner,
} = require("../middleware/auth");
const { authUser, authMerchant } = require("../middleware/auth");
const { errorCheck } = require("../validators/errorCheck");

// User routes for orders
router.post(
  "/orders",
  authUser,
  authUserOrderOwner,
  validateFetchUserOrders,
  errorCheck,
  getOrdersByUserId
); // get user's orders sorted in date descending order
router.put(
  "/orders",
  authUser,
  authCartOwner,
  validateBodyId,
  errorCheck,
  addNewOrder
); // check out user's cart/create new orders by user

// Merchant routes for orders
router.post(
  "/orders/manage",
  authMerchant,
  authMerchantOrderOwner,
  validateBodyMerchant,
  errorCheck,
  getOrdersByMerchantId
); // get all orders for merchant
router.put(
  "/orders/manage",
  authMerchant,
  authMerchantOrderOwner,
  validateBodyId,
  validateUserCollected,
  errorCheck,
  updateOrderById
); // merchant to confirm collection of user order
router.delete(
  "/orders/manage",
  authMerchant,
  authMerchantOrderOwner,
  validateBodyId,
  errorCheck,
  deleteOrderById
); // delete order

module.exports = router;

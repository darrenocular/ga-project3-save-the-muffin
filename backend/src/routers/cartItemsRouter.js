const express = require("express");
const router = express.Router();
const {
  seedCart,
  getCartByUserId,
  updateCartItem,
  deleteCartItem,
  clearUserCart,
} = require("../controllers/cartItemsController");
const {
  validateUserIdInBody,
  validateCartIdAndQuantityInBody,
} = require("../validators/cartItemsValidator");
const { errorCheck } = require("../validators/errorCheck");

router.get("/cart/seed", seedCart); // seed cart by user id
router.post("/cart", validateUserIdInBody, errorCheck, getCartByUserId); // get user's cart items
router.patch(
  "/cart",
  validateCartIdAndQuantityInBody,
  errorCheck,
  updateCartItem
); // update user's cart item
router.delete(
  "/cart",
  validateCartIdAndQuantityInBody,
  errorCheck,
  deleteCartItem
); // delete user's cart item
router.delete("/cart/all", validateUserIdInBody, errorCheck, clearUserCart); // clear user cart

module.exports = router;

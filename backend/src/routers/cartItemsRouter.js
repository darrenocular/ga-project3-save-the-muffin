const express = require("express");
const router = express.Router();
const {
  addCartItem,
  getCartByUserId,
  updateCartItem,
  deleteCartItem,
  clearUserCart,
} = require("../controllers/cartItemsController");
const { authUser, authCartOwner } = require("../middleware/auth");
const {
  validateUserIdInBody,
  validateCartIdAndQuantityInBody,
  validateListingIdAndQuantityInBody,
} = require("../validators/cartItemsValidator");
const { errorCheck } = require("../validators/errorCheck");

router.put(
  "/cart",
  authUser,
  authCartOwner,
  validateUserIdInBody,
  validateListingIdAndQuantityInBody,
  errorCheck,
  addCartItem
); // add cart item
router.post(
  "/cart",
  authUser,
  authCartOwner,
  validateUserIdInBody,
  errorCheck,
  getCartByUserId
); // get user's cart items
router.patch(
  "/cart",
  authUser,
  authCartOwner,
  validateCartIdAndQuantityInBody,
  errorCheck,
  updateCartItem
); // update user's cart item
router.delete(
  "/cart",
  authUser,
  authCartOwner,
  validateCartIdAndQuantityInBody,
  errorCheck,
  deleteCartItem
); // delete user's cart item
router.delete(
  "/cart/all",
  authUser,
  authCartOwner,
  validateUserIdInBody,
  errorCheck,
  clearUserCart
); // clear user cart

module.exports = router;

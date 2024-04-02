const express = require("express");
const router = express.Router();
const {
  seedCart,
  getCartByUserId,
  updateCartItem,
  deleteCartItem,
  clearUserCart,
} = require("../controllers/cartItemsController");

router.get("/cart/seed", seedCart); // seed cart by user id
router.post("/cart", getCartByUserId); // get user's cart items
router.patch("/cart", updateCartItem); // update user's cart item
router.delete("/cart", deleteCartItem); // delete user's cart item
router.delete("/cart/all", clearUserCart); // clear user cart

module.exports = router;

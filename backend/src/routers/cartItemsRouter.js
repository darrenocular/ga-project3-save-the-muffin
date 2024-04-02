const express = require("express");
const router = express.Router();
const {
  seedCart,
  getCartByUserId,
  updateCartItemByUserId,
  deleteCartItemByUserId,
} = require("../controllers/cartItemsController");

router.get("/cart/seed", seedCart); // seed cart by user id
router.post("/cart", getCartByUserId); // get user's cart items
router.patch("/cart", updateCartItemByUserId); // update user's cart item
router.delete("/cart", deleteCartItemByUserId); // delete user's cart item

module.exports = router;

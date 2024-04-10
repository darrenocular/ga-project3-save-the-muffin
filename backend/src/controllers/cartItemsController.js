const Cart = require("../models/CartItem");

const addCartItem = async (req, res) => {
  try {
    const newCartItem = {
      user: req.body.user,
      listing: req.body.listing,
      cartQuantity: req.body.cartQuantity,
    };

    await Cart.create(newCartItem);
    res.json({ status: "ok", msg: "cart item added" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "failed to add cart item" });
  }
};

const getCartByUserId = async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.body.user })
      .populate([
        "user",
        {
          path: "listing",
          populate: { path: "merchant", model: "Auth" },
        },
      ])
      .exec();

    res.json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "failed to get cart" });
  }
};

const updateCartItem = async (req, res) => {
  try {
    await Cart.findByIdAndUpdate(req.body.id, req.body, {
      runValidators: true,
    });

    res.json({ status: "ok", msg: "cart item updated" });
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "failed to update cart item" });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.body.id);
    res.json({ status: "ok", msg: "cart item deleted" });
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "failed to delete cart item" });
  }
};

const clearUserCart = async (req, res) => {
  try {
    await Cart.deleteMany({ user: req.body.user });

    res.json({ status: "ok", msg: "cart cleared" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "failed to clear cart" });
  }
};

module.exports = {
  addCartItem,
  getCartByUserId,
  updateCartItem,
  deleteCartItem,
  clearUserCart,
};

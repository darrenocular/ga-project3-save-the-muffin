const Cart = require("../models/CartItem");

const seedCart = async (req, res) => {
  try {
    await Cart.deleteMany();

    await Cart.create([
      {
        user: "660b7382f4e248c36c993f29",
        listing: "660bad3fc922afc10866d612", // nasi lemak
        cartQuantity: 5,
      },
      {
        user: "660b7382f4e248c36c993f29",
        listing: "660bad3fc922afc10866d610", // blueberry muffin
        cartQuantity: 4,
      },
      {
        user: "660b73a2f4e248c36c993f2b",
        listing: "660bad3fc922afc10866d610", // blueberry muffin
        cartQuantity: 5,
      },
      {
        user: "660b73a2f4e248c36c993f2b",
        listing: "660bad3fc922afc10866d611", // banana walnut muffin
        cartQuantity: 5,
      },
    ]);

    res.json({ status: "ok", msg: "seed success" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "seed fail" });
  }
};

const getCartByUserId = async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.body.user })
      .populate("user listing")
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
  seedCart,
  getCartByUserId,
  updateCartItem,
  deleteCartItem,
  clearUserCart,
};

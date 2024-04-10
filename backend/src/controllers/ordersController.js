const Orders = require("../models/Order");
const { Listings } = require("../models/Listing");
const CartItem = require("../models/CartItem");
const mongoose = require("mongoose");

const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Orders.find({ user: req.body.user })
      .sort({
        "listing.collectionDate": -1,
      })
      .populate("merchant")
      .exec();
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "error getting orders by user id" });
  }
};

const addNewOrder = async (req, res) => {
  try {
    const { id } = req.body; //getting cart id
    const cart = await CartItem.findOne({ _id: id }).populate("user").exec(); //find the cart in the db

    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", msg: "Cart item not found" });
    } //checking if cart exists

    const listingId = cart.listing; //find what listingId is attached to this cart
    const listingsData = await Listings.findOne({
      _id: listingId,
    });

    if (!listingsData) {
      return res
        .status(404)
        .json({ status: "error", msg: "Listing item not found" });
    } //check if listingId is correct or not

    if (listingsData.quantity < cart.cartQuantity) {
      return res
        .status(400)
        .json({ status: "error", msg: "Insufficient stock" }); //checking that stock of item in listing is greater than user's cart item
    }

    const newOrder = new Orders({
      user: cart.user,
      merchant: listingsData.merchant._id,
      listing: listingsData,
      purchaseQuantity: cart.cartQuantity,
      totalPrice: cart.cartQuantity * listingsData.discountedPrice,
    }); //this code block creates the new order

    const order = await newOrder.save(); //saving it into the db

    listingsData.quantity -= cart.cartQuantity; //logic for minus the cart item from stock listings
    await listingsData.save(); //saving to db

    await CartItem.deleteOne({ _id: id }); //delete the checkout logic

    res.json({
      status: "ok",
      msg: "Order added successfully",
      newOrder,
    }); //send the response
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Failed to add new order" });
  }
}; //error handling

const getOrdersByMerchantId = async (req, res) => {
  try {
    const orders = await Orders.find({
      merchant: req.body.merchant,
    })
      .populate("user")
      .exec();
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "error getting orders by merchant id" });
  }
};

//patch

const updateOrderById = async (req, res) => {
  try {
    const { id, isCollected } = req.body;

    //check for id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "error", msg: "Invalid order ID" });
    }

    if (isCollected === undefined) {
      return res
        .status(400)
        .json({ status: "error", msg: "Invalid collectedOrNot value" });
    }

    const updatedOrder = await Orders.findByIdAndUpdate(
      id,
      { isCollected: isCollected },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ status: "error", msg: "Order not found" });
    }

    res.json({
      status: "ok",
      msg: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Failed to update order" });
  }
};

const deleteOrderById = async (req, res) => {
  try {
    const { id } = req.body;

    const deletedOrder = await Orders.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ status: "error", msg: "Order not found" });
    }

    res.json({
      status: "ok",
      msg: "Order deleted successfully",
      order: deletedOrder,
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Failed to delete order" });
  }
};

module.exports = {
  getOrdersByUserId,
  addNewOrder,
  getOrdersByMerchantId,
  updateOrderById,
  deleteOrderById,
};

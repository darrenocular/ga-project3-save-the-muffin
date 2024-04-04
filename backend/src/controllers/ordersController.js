const Orders = require("../models/Order");
const { Listings } = require("../models/Listing");
const CartItem = require("../models/CartItem");
const mongoose = require("mongoose");

const seedOrders = async (req, res) => {
  try {
    await Orders.deleteMany();

    await Orders.create([
      {
        user: "660b7382f4e248c36c993f29",
        merchant: "660b73d4f4e248c36c993f2d",
        // listing: "660bad3fc922afc10866d610", // Blueberry Muffin
        listing: await Listings.findById("660bad3fc922afc10866d610"), // Blueberry Muffin
        purchaseQuantity: 4,
        totalPrice: 6,
      },
      {
        user: "660b7382f4e248c36c993f29",
        merchant: "660b7406f4e248c36c993f2f",
        // listing: "660bad3fc922afc10866d612", // Nasi Lemak
        listing: await Listings.findById("660bad3fc922afc10866d612"), // Nasi Lemak
        purchaseQuantity: 5,
        totalPrice: 25,
      },
      {
        user: "660b73a2f4e248c36c993f2b",
        merchant: "660b73d4f4e248c36c993f2d",
        // listing: "660bad3fc922afc10866d611", // Banana Walnut Muffin
        listing: await Listings.findById("660bad3fc922afc10866d611"), // Banana Walnut Muffin
        purchaseQuantity: 5,
        totalPrice: 8.5,
      },
    ]);
    res.json({ status: "ok", msg: "seed success" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "seed fail" });
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Orders.find({ user: req.body.id }).sort({
      "listing.collectionDate": -1,
    });
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "error getting orders by user id" });
  }
};

const addNewOrder = async (req, res) => {
  //put api
  try {
    const { user, merchant, listing, purchaseQuantity, totalPrice } = req.body;

    // Check if merchant and listing are valid ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(merchant) ||
      !mongoose.Types.ObjectId.isValid(listing)
    ) {
      return res
        .status(400)
        .json({ status: "error", msg: "Invalid merchant or listing ID" });
    }

    // Check if purchaseQuantity is provided
    if (!purchaseQuantity) {
      return res
        .status(400)
        .json({ status: "error", msg: "Purchase quantity is required" });
    }

    const newOrder = new Orders({
      user,
      merchant,
      listing,
      purchaseQuantity,
      totalPrice,
    });

    await newOrder.save();

    res.json({
      status: "ok",
      msg: "Order added successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Failed to add new order" });
  }
};

const getOrdersByMerchantId = async (req, res) => {
  try {
    console.log(req.body.id);
    const orders = await Orders.find({ merchant: req.body.id });
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
    // const orderId = req.params.orderId;
    const { purchaseQuantity, totalPrice, orderId } = req.body;
    console.log(orderId);

    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      {
        purchaseQuantity,
        totalPrice,
      },
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

//delete one
const deleteOrderById = async (req, res) => {
  try {
    // const orderId = req.params.orderId;
    const { orderId } = req.body;

    const deletedOrder = await Orders.findByIdAndDelete(orderId);

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
  seedOrders,
  getOrdersByUserId,
  addNewOrder,
  getOrdersByMerchantId,
  updateOrderById,
  deleteOrderById,
};

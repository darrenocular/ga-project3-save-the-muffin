const Orders = require("../models/Order");
const { Listings } = require("../models/Listing");

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

const addNewOrder = async (req, res) => {};

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

const updateOrderById = async (req, res) => {};

const deleteOrderById = async (req, res) => {};

module.exports = {
  seedOrders,
  getOrdersByUserId,
  addNewOrder,
  getOrdersByMerchantId,
  updateOrderById,
  deleteOrderById,
};

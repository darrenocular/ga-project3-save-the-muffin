const Listings = require("../models/Listing");

const getAllListings = async (req, res) => {
  try {
    const listings = await Listings.find();

    res.json(listings);
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "failed to get all listings" });
  }
};

const seedListings = async (req, res) => {
  try {
    await Listings.deleteMany();

    await Listings.create([
      {
        merchant: "660b73d4f4e248c36c993f2d",
        name: "Blueberry Muffin",
        originalPrice: 1.8,
        discountedPrice: 1.5,
        quantity: 40,
        description: "Gluten-free",
        category: "pastries",
        collectionDate: new Date("2024-04-05T17:00:00"),
      },
      {
        merchant: "660b73d4f4e248c36c993f2d",
        name: "Banana Walnut Muffin",
        originalPrice: 2,
        discountedPrice: 1.7,
        quantity: 40,
        description: "Allergy: nuts",
        category: "pastries",
        collectionDate: new Date("2024-04-05T17:00:00"),
      },
      {
        merchant: "660b7406f4e248c36c993f2f",
        name: "Nasi Lemak",
        originalPrice: 3,
        discountedPrice: 2.5,
        quantity: 10,
        description: "Available with or without chilli",
        category: "asian",
        collectionDate: new Date("2024-04-05T12:00:00"),
      },
    ]);
    res.json({ status: "ok", msg: "seed success" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "seed fail" });
  }
};

const addNewListing = async (req, res) => {
  try {
    const newListing = {
      merchant: req.body.merchant,
      name: req.body.name,
      originalPrice: req.body.originalPrice,
      discountedPrice: req.body.discountedPrice,
      quantity: req.body.quantity,
      description: req.body.description || "",
      category: req.body.category,
      image: req.body.image || "",
      collectionDate: new Date(req.body.collectionDate),
    };

    await Listings.create(newListing);
    res.json({ status: "ok", msg: "new listing added" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "failed to add new listing" });
  }
};

const updateListingById = async (req, res) => {
  try {
    await Listings.findByIdAndUpdate(req.body.id, req.body, {
      runValidators: true,
    });
    res.json({ status: "ok", msg: "listing updated" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "failed to update listing" });
  }
};

const deleteListingById = async (req, res) => {
  try {
    await Listings.findByIdAndDelete(req.body.id);
    res.json({ status: "ok", msg: "listing deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "failed to delete listing" });
  }
};

const getListingById = async (req, res) => {
  try {
    const listing = await Listings.findById(req.body.id);
    res.json(listing);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "failed to get listing" });
  }
};

const getListingsByMerchantId = async (req, res) => {
  try {
    const listings = await Listings.find({ merchant: req.body.merchant });
    res.json(listings);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "failed to get listings" });
  }
};

module.exports = {
  getAllListings,
  addNewListing,
  updateListingById,
  deleteListingById,
  getListingById,
  seedListings,
  getListingsByMerchantId,
};

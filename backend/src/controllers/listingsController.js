const { Listings, ListingSchema } = require("../models/Listing");
const { Auth } = require("../models/Auth");

const getAllListings = async (req, res) => {
  try {
    const listings = await Listings.find({
      collectionDate: { $gt: Date.now() },
      quantity: { $gt: 0 },
    })
      .sort("collectionDate")
      .populate("merchant")
      .exec();

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
        category: "Pastries",
        collectionDate: new Date("2024-04-05T17:00:00"),
        latitude: 1.27590110812862,
        longitude: 103.842656784977,
      },
      {
        merchant: "660b73d4f4e248c36c993f2d",
        name: "Banana Walnut Muffin",
        originalPrice: 2,
        discountedPrice: 1.7,
        quantity: 40,
        description: "Allergy: nuts",
        category: "Pastries",
        collectionDate: new Date("2024-04-05T17:00:00"),
        latitude: 1.27590110812862,
        longitude: 103.842656784977,
      },
      {
        merchant: "660b7406f4e248c36c993f2f",
        name: "Nasi Lemak",
        originalPrice: 3,
        discountedPrice: 2.5,
        quantity: 10,
        description: "Available with or without chilli",
        category: "Asian",
        collectionDate: new Date("2024-04-05T12:00:00"),
        latitude: 1.34522406568893,
        longitude: 103.712800680774,
      },
    ]);
    res.json({ status: "ok", msg: "seed success" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "seed fail" });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await ListingSchema.path("category").enumValues;
    res.json(categories);
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "error getting food categories" });
  }
};

const addNewListing = async (req, res) => {
  try {
    const merchant = await Auth.findById(req.body.merchant);

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
      longitude: merchant.merchantDetails.longitude,
      latitude: merchant.merchantDetails.latitude,
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
    const listings = await Listings.find({ merchant: req.body.merchant })
      .populate("merchant")
      .exec();

    res.json(listings);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "failed to get listings" });
  }
};

const getEnum = async (req, res) => {
  try {
    const foodCategories = await ListingSchema.path("category").enumValues;

    res.json({ foodCategories });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "failed to get enum" });
  }
};

const getNearbyListings = async (req, res) => {
  try {
    // using simplified filter for shops given Singapore's small size
    // Singapore latitude = 1.3521° N, longitude 103.8198° E (in degrees)
    // Length in km of 1° of latitude = always 111.32 km
    // Length in km of 1° of longitude = 40075 km * cos( latitude in radians ) / 360
    // const KMPerLongitudePerDegreeInSingapore = 40075 * Math.cos( 1.3521 * Math.PI / 180) / 360 = 111.288

    const KMPerLongitudePerDegreeInSingapore = 111.288;
    const KMPerLatitudePerDegreeWorldwide = 111.32;

    const perKMLongitude = 1 / 111.288;
    const perKMLatitude = 1 / 111.32;
    let defaultMaxDistance = 2;

    const { latitude, longitude, maxDistance = defaultMaxDistance } = req.body;

    const minLat = latitude - maxDistance * perKMLatitude;
    const maxLat = latitude + maxDistance * perKMLatitude;
    const minLong = longitude - maxDistance * perKMLongitude;
    const maxLong = longitude + maxDistance * perKMLongitude;

    const listings = await Listings.find({
      longitude: { $gte: minLong, $lte: maxLong },
      latitude: { $gte: minLat, $lte: maxLat },
      collectionDate: { $gt: Date.now() },
      quantity: { $gt: 0 },
    })
      .populate("merchant")
      .exec();

    res.json({ listings });
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "error in getting nearby listings" });
  }
};

module.exports = {
  getAllListings,
  addNewListing,
  getAllCategories,
  updateListingById,
  deleteListingById,
  getListingById,
  seedListings,
  getListingsByMerchantId,
  getEnum,
  getNearbyListings,
};

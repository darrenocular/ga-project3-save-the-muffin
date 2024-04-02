const express = require("express");
const router = express.Router();
const {
  getAllListings,
  seedListings,
  addNewListing,
  updateListingById,
  deleteListingById,
  getListingById,
  getListingsByMerchantId,
} = require("../controllers/listingsController");

router.get("/listings", getAllListings); // get all listings
router.get("/listings/seed", seedListings); // seed listings
router.put("/listings", addNewListing); // add a new listing
router.patch("/listings", updateListingById); // update a particular listing
router.delete("/listings", deleteListingById); // delete a listing
router.post("/listings", getListingById); // get a listing by listing id
router.post("/listings/merchant", getListingsByMerchantId); // get listings by merchant id

module.exports = router;

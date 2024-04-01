const express = require("express");
const router = express.Router();
const {
  getAllListings,
  addNewListing,
  updateListingById,
  deleteListingById,
  getListingById,
} = require("../controllers/listingsController");

router.get("/listings", getAllListings); // get all listings
router.put("/listings", addNewListing); // add a new listing
router.patch("/listings", updateListingById); // update a particular listing
router.delete("/listings", deleteListingById); // delete a listing
router.post("/listings", getListingById); // get a listing

module.exports = router;

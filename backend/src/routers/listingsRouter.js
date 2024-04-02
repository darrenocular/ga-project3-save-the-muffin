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
  getEnum,
} = require("../controllers/listingsController");
const {
  validateNewListingInput,
  validateUpdateListingInput,
} = require("../validators/listingsValidator");
const { errorCheck } = require("../validators/errorCheck");

router.get("/listings", getAllListings); // get all listings
router.get("/listings/seed", seedListings); // seed listings
router.put("/listings", validateNewListingInput, errorCheck, addNewListing); // add a new listing
router.patch(
  "/listings",
  validateUpdateListingInput,
  errorCheck,
  updateListingById
); // update a particular listing
router.delete("/listings", deleteListingById); // delete a listing
router.post("/listings", getListingById); // get a listing by listing id
router.post("/listings/merchant", getListingsByMerchantId); // get listings by merchant id
router.get("/listings/enum", getEnum); // get enum values

module.exports = router;

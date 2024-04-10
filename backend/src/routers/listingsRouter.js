const express = require("express");
const router = express.Router();
const {
  getAllListings,
  getAllCategories,
  addNewListing,
  updateListingById,
  deleteListingById,
  getListingById,
  getListingsByMerchantId,
  getEnum,
  getNearbyListings,
} = require("../controllers/listingsController");
const { authMerchant, authListingOwner } = require("../middleware/auth");
const {
  validateNewListingInput,
  validateUpdateListingInput,
  validateBodyId,
  validateBodyMerchant,
} = require("../validators/listingsValidator");
const { errorCheck } = require("../validators/errorCheck");

router.get("/listings", getAllListings); // get all listings
router.get("/listings/categories", getAllCategories); // get food categories
router.put(
  "/listings",
  authMerchant,
  authListingOwner,
  validateNewListingInput,
  errorCheck,
  addNewListing
); // add a new listing
router.patch(
  "/listings",
  authMerchant,
  authListingOwner,
  validateUpdateListingInput,
  errorCheck,
  updateListingById
); // update a particular listing
router.delete(
  "/listings",
  authMerchant,
  authListingOwner,
  validateBodyId,
  errorCheck,
  deleteListingById
); // delete a listing
router.post("/listings", validateBodyId, errorCheck, getListingById); // get a listing by listing id
router.post(
  "/listings/merchant",
  validateBodyMerchant,
  errorCheck,
  getListingsByMerchantId
); // get listings by merchant id
router.get("/listings/enum", getEnum); // get enum values
router.post("/listings/nearby", getNearbyListings); // get nearby listings

module.exports = router;

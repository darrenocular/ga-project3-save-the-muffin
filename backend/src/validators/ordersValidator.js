const { body } = require("express-validator");

const validateFetchUserOrders = [
  body("user", "user id is required").not().isEmpty(),
  body("user", "invalid user id").isMongoId(),
  body("user", "invalid user id").isLength({ min: 24, max: 24 }),
];

const validateUserCollected = [
  body("isCollected", "isCollected field required").not().isEmpty(),
  body("isCollected", "isCollected has to be boolean").isBoolean(),
];

const validateBodyId = [
  body("id", "order id is required").not().isEmpty(),
  body("id", "invalid order id").isMongoId(),
  body("id", "invalid order id").isLength({ min: 24, max: 24 }),
];

const validateBodyMerchant = [
  body("merchant", "merchant id is required").not().isEmpty(),
  body("merchant", "invalid merchant id").isMongoId(),
  body("merchant", "invalid merchant id").isLength({ min: 24, max: 24 }),
];

module.exports = {
  validateFetchUserOrders,
  validateUserCollected,
  validateBodyId,
  validateBodyMerchant,
};

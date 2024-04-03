const { body } = require("express-validator");

const validateUserIdInBody = [
  body("user", "user id is required").not().isEmpty(),
  body("user", "invalid user id").isLength({ min: 24, max: 24 }),
];

const validateCartIdAndQuantityInBody = [
  body("id", "cart item id is required").not().isEmpty(),
  body("id", "invalid cart item id").isLength({ min: 24, max: 24 }),
  body("cartQuantity", "cart quantity is required").optional().not().isEmpty(),
  body("cartQuantity", "invalid cart quantity")
    .if(body("cartQuantity").not().isEmpty())
    .isInt({ min: 0, max: 1000 }),
];

module.exports = { validateUserIdInBody, validateCartIdAndQuantityInBody };

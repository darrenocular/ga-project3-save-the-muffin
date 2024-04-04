const { body } = require("express-validator");

const validateNewListingInput = [
  body("merchant", "merchant id is required").not().isEmpty(),
  body("merchant", "invalid merchant id").isMongoId(),
  body("merchant", "invalid merchant id").isLength({ min: 24, max: 24 }),
  body("name", "name is required").not().isEmpty(),
  body("name", "invalid name").isLength({ min: 1, max: 50 }),
  body("originalPrice", "original price is required").not().isEmpty(),
  body("originalPrice", "invalid original price").isFloat({
    min: 0,
    max: 1000,
  }),
  body("discountedPrice", "discounted price is required").not().isEmpty(),
  body("discountedPrice", "invalid discounted price").isFloat({
    min: 0,
    max: 1000,
  }),
  body("quantity", "quantity is required").not().isEmpty(),
  body("quantity", "invalid quantity").isInt({
    min: 1,
    max: 1000,
  }),
  body("description", "invalid description").isLength({ min: 0, max: 500 }),
  body("category", "category is required").not().isEmpty(),
  body("category", "invalid category").isIn([
    "asian",
    "beverages",
    "western",
    "dessert",
    "salad",
    "pastries",
  ]),
  body("image", "invalid image url").isLength({ min: 0, max: 500 }),
  body("collectionDate", "date/time is required").not().isEmpty(),
  body("collectionDate", "invalid date/time").isISO8601(),
];

const validateUpdateListingInput = [
  body("id", "listing id is required").not().isEmpty(),
  body("id", "invalid listing id").isMongoId(),
  body("id", "invalid listing id").isLength({ min: 24, max: 24 }),
  body("merchant", "merchant id is required").optional().not().isEmpty(),
  body("merchant", "invalid merchant id").isMongoId(),
  body("merchant", "invalid merchant id")
    .if(body("merchant").not().isEmpty())
    .isLength({ min: 24, max: 24 }),
  body("name", "name is required").optional().not().isEmpty(),
  body("name", "invalid name")
    .if(body("name").not().isEmpty())
    .isLength({ min: 1, max: 50 }),
  body("originalPrice", "original price is required")
    .optional()
    .not()
    .isEmpty(),
  body("originalPrice", "invalid original price")
    .if(body("originalPrice").not().isEmpty())
    .isFloat({
      min: 0,
      max: 1000,
    }),
  body("discountedPrice", "discounted price is required")
    .optional()
    .not()
    .isEmpty(),
  body("discountedPrice", "invalid discounted price")
    .if(body("discountedPrice").not().isEmpty())
    .isFloat({
      min: 0,
      max: 1000,
    }),
  body("quantity", "quantity is required").optional().not().isEmpty(),
  body("quantity", "invalid quantity")
    .if(body("quantity").not().isEmpty())
    .isInt({
      min: 1,
      max: 1000,
    }),
  body("description", "invalid description").isLength({ min: 0, max: 500 }),
  body("category", "category is required").optional().not().isEmpty(),
  body("category", "invalid category")
    .if(body("category").not().isEmpty())
    .isIn(["asian", "beverages", "western", "dessert", "salad", "pastries"]),
  body("image", "invalid image url").isLength({ min: 0, max: 500 }),
  body("collectionDate", "date/time is required").optional().not().isEmpty(),
  body("collectionDate", "invalid date/time")
    .if(body("collectionDate").not().isEmpty())
    .isISO8601(),
];

module.exports = { validateNewListingInput, validateUpdateListingInput };

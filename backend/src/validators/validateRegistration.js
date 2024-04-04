const {
  validateUserRegistration,
  validateMerchantRegistration,
} = require("./authValidator");

const validateRegistration = (req, res, next) => {
  const validations = [...validateUserRegistration];
  if (req.body.role === "merchant") {
    validations.push(...validateMerchantRegistration);
  }
  return validations;
};

module.exports = { validateRegistration };

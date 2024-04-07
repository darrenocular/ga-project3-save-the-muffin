const express = require("express");
const router = express.Router();
const {
  checkDuplicateEmail,
  checkPassword,
  register,
  login,
  refresh,
  getEnum,
} = require("../controllers/authController");
const {
  validatePasswordPresent,
  validateEmailPresent,
  validateRefresh,
  validateAllRegistration,
  validatePasswordStrength,
} = require("../validators/authValidator");
const { validateRegistration } = require("../validators/validateRegistration");
const { errorCheck } = require("../validators/errorCheck");

router.post("/check-email", checkDuplicateEmail);
router.post(
  "/check-password",
  validatePasswordStrength,
  errorCheck,
  checkPassword
);
router.put("/register", validateAllRegistration, errorCheck, register);
// router.put("/register", register);

router.post(
  "/login",
  validateEmailPresent,
  validatePasswordPresent,
  errorCheck,
  login
);
router.post("/refresh", validateRefresh, errorCheck, refresh);
router.get("/enum", getEnum);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  checkDuplicateEmail,
  register,
  login,
  refresh,
  getEnum,
} = require("../controllers/authController");

router.post("/check-email", checkDuplicateEmail);
router.put("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.get("/enum", getEnum);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refresh,
  getEnum,
} = require("../controllers/authController");

router.put("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.get("/enum", getEnum);

module.exports = router;

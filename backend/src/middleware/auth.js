const jwt = require("jsonwebtoken");
const { Listings } = require("../models/Listing");
const CartItem = require("../models/CartItem");
const { Order } = require("../models/Order");

const authUser = (req, res, next) => {
  if (!("authorization" in req.headers)) {
    return res.status(400).json({ status: "error", msg: "no token found" });
  }

  const token = req.headers["authorization"].replace("Bearer ", "");

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      if (decoded.role === "user") {
        req.decoded = decoded;
        next();
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error.message);
      return res.status(401).json({ status: "error", msg: "unauthorized" });
    }
  } else {
    return res.status(403).json({ status: "error", msg: "missing token" });
  }
};

const authMerchant = (req, res, next) => {
  if (!("authorization" in req.headers)) {
    return res.status(400).json({ status: "error", msg: "no token found" });
  }

  const token = req.headers["authorization"].replace("Bearer ", "");

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      if (decoded.role === "merchant") {
        req.decoded = decoded;
        next();
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error.message);
      return res.status(401).json({ status: "error", msg: "unauthorized" });
    }
  } else {
    return res.status(403).json({ status: "error", msg: "missing token" });
  }
};

const authCartOwner = async (req, res, next) => {
  if (req.body.id) {
    const cart = await CartItem.findById(req.body.id);

    if (!cart) {
      next();
    }

    if (cart.user.toString() !== req.decoded.id) {
      return res.status(403).json({ status: "error", msg: "unauthorized" });
    }
  }

  if (req.body.user) {
    if (req.body.user !== req.decoded.id) {
      return res.status(403).json({ status: "error", msg: "unauthorized" });
    }
  }
  next();
};

const authListingOwner = async (req, res, next) => {
  if (req.body.id) {
    const listing = await Listings.findById(req.body.id);

    if (!listing) {
      next();
    }

    if (listing.merchant.toString() !== req.decoded.id) {
      return res.status(403).json({ status: "error", msg: "unauthorized" });
    }
  }

  if (req.body.merchant) {
    if (req.body.merchant !== req.decoded.id) {
      return res.status(403).json({ status: "error", msg: "unauthorized" });
    }
  }
  next();
};

const authMerchantOrder = async (req, res, next) => {
  if (req.body.id) {
    const order = await Order.findById(req.body.id);

    if (!order) {
      next();
    }
    // console.log(order.merchant.toString());
    // console.log(req.decoded.id);
    // console.log(order.merchant.toString() === req.decoded.id);

    if (order.merchant.toString() !== req.decoded.id) {
      return res.status(403).json({ status: "error", msg: "unauthorized" });
    }
  }

  if (req.body.merchant) {
    if (req.body.merchant !== req.decoded.id) {
      return res.status(403).json({ status: "error", msg: "unauthorized" });
    }
  }
  next();
};

module.exports = {
  authUser,
  authMerchant,
  authCartOwner,
  authListingOwner,
  authMerchantOrder,
};

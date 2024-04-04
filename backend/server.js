require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./src/db/db");
const listingsRouter = require("./src/routers/listingsRouter");
const authRouter = require("./src/routers/authRouter");
const cartItemsRouter = require("./src/routers/cartItemsRouter");
const ordersRouter = require("./src/routers/ordersRouter");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
connectDB();

app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", listingsRouter);
app.use("/api", cartItemsRouter);
app.use("/api", ordersRouter);
app.use("/auth", authRouter);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.log(err);
    return res
      .status(404)
      .json({ status: "error", msg: "an error has occurred" });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

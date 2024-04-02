const { Auth, AuthSchema } = require("../models/Auth");

const register = async () => {};

const login = async () => {};

const refresh = async () => {};

const getEnum = async (req, res) => {
  try {
    const areas = await AuthSchema.path("merchantDetails.area").enumValues;
    const accountTypes = await AuthSchema.path("accountType").enumValues;

    res.json({ areas, accountTypes });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "fail to get enum" });
  }
};

module.exports = { register, login, refresh, getEnum };

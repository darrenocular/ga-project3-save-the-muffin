const mongoose = require("mongoose");

const areas = [
  "BEDOK",
  "BUKIT TIMAH",
  "BUKIT BATOK",
  "BUKIT MERAH",
  "CENTRAL WATER CATCHMENT",
  "DOWNTOWN CORE",
  "CHANGI",
  "CHANGI BAY",
  "LIM CHU KANG",
  "BOON LAY",
  "WESTERN WATER CATCHMENT",
  "WOODLANDS",
  "MARINE PARADE",
  "NEWTON",
  "NORTH-EASTERN ISLANDS",
  "ORCHARD",
  "PASIR RIS",
  "PIONEER",
  "PUNGGOL",
  "QUEENSTOWN",
  "SEMBAWANG",
  "SIMPANG",
  "TAMPINES",
  "TANGLIN",
  "TUAS",
  "WESTERN ISLANDS",
  "SOUTHERN ISLANDS",
  "BUKIT PANJANG",
  "BISHAN",
  "ANG MO KIO",
  "GEYLANG",
  "STRAITS VIEW",
  "JURONG EAST",
  "HOUGANG",
  "JURONG WEST",
  "CHOA CHU KANG",
  "KALLANG",
  "MANDAI",
  "TENGAH",
  "MARINA EAST",
  "MARINA SOUTH",
  "MUSEUM",
  "NOVENA",
  "OUTRAM",
  "PAYA LEBAR",
  "RIVER VALLEY",
  "ROCHOR",
  "SELETAR",
  "SENGKANG",
  "SERANGOON",
  "CLEMENTI",
  "TOA PAYOH",
  "SINGAPORE RIVER",
  "SUNGEI KADUT",
  "YISHUN",
];

const MerchantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  area: { type: String, enum: areas, required: true },
  coordinates: { type: String },
  description: { type: String, required: true },
  image: { type: String },
});

const AuthSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    hash: { type: String, required: true },
    accountType: {
      type: String,
      enum: ["user", "merchant"],
      required: true,
      default: "user",
    },
    merchantDetails: MerchantSchema,
  },
  {
    timestamps: true,
    collection: "auth",
  }
);

const Auth = mongoose.model("Auth", AuthSchema);
module.exports = { Auth, AuthSchema };

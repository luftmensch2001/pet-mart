const mongoose = require("mongoose");
const schema = mongoose.Schema;

const AddressSchema = new schema({
  accountId: {
    type: schema.Types.ObjectId,
    ref: "accounts",
  },
  fullName: {
    type: String,
    require: true,
  },
  phoneNumber: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
  district: {
    type: String,
    require: true,
  },
  ward: {
    type: String,
    require: true,
  },
  detail: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("address", AddressSchema);

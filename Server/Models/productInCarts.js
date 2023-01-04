const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ProductInCartsSchema = new schema({
  accountId: {
    type: schema.Types.ObjectId,
    ref: "accounts",
  },
  productId: {
    type: schema.Types.ObjectId,
    ref: "products",
  },
  count: {
    type: Number,
    require: true,
  },
  color: {
    type: String,
  },
});

module.exports = mongoose.model("productInCarts", ProductInCartsSchema);

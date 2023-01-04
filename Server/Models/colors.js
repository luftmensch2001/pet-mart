const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ColorsSchema = new schema({
  productId: {
    type: schema.Types.ObjectId,
    ref: "products",
  },
  name: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("colors", ColorsSchema);

const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ProductInFavoritesSchema = new schema({
    accountId: {
        type: schema.Types.ObjectId,
        ref: "accounts",
    },
    productId: {
        type: schema.Types.ObjectId,
        ref: "products",
    },
});

module.exports = mongoose.model("productInFavorites", ProductInFavoritesSchema);
